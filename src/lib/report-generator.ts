import jsPDF from "jspdf";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer } from "docx";
import { saveAs } from "file-saver";

export interface ReportData {
  title: string;
  content: string;
  charts?: Array<{
    title: string;
    dataUrl: string; // base64 image data
  }>;
  metadata?: {
    generatedAt: string;
    reportType: string;
    dataPoints: number;
  };
}

export async function generatePDF(reportData: ReportData): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Header with title
  doc.setFillColor(41, 98, 255);
  doc.rect(0, 0, pageWidth, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(reportData.title, margin, 25);

  // Metadata
  if (reportData.metadata) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date(reportData.metadata.generatedAt).toLocaleString()}`, margin, 35);
  }

  yPosition = 50;

  // Parse content by sections
  const sections = reportData.content.split(/(?=##\s)/);
  
  doc.setTextColor(0, 0, 0);
  
  for (const section of sections) {
    const lines = section.split("\n").filter(line => line.trim());
    
    for (const line of lines) {
      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      // Section headers (##)
      if (line.startsWith("##")) {
        yPosition += 5;
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(41, 98, 255);
        const headerText = line.replace(/^##\s*/, "");
        doc.text(headerText, margin, yPosition);
        yPosition += 10;
        doc.setTextColor(0, 0, 0);
        continue;
      }

      // Subsection headers (###)
      if (line.startsWith("###")) {
        yPosition += 3;
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const subheaderText = line.replace(/^###\s*/, "");
        doc.text(subheaderText, margin, yPosition);
        yPosition += 8;
        continue;
      }

      // Bullet points
      if (line.startsWith("-") || line.startsWith("*")) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const bulletText = line.replace(/^[-*]\s*/, "");
        const wrappedText = doc.splitTextToSize(`• ${bulletText}`, contentWidth - 5);
        doc.text(wrappedText, margin + 5, yPosition);
        yPosition += wrappedText.length * 5;
        continue;
      }

      // Regular paragraphs
      if (line.trim()) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const wrappedText = doc.splitTextToSize(line, contentWidth);
        doc.text(wrappedText, margin, yPosition);
        yPosition += wrappedText.length * 5 + 3;
      }
    }
  }

  // Add charts if provided
  if (reportData.charts && reportData.charts.length > 0) {
    for (const chart of reportData.charts) {
      if (yPosition > pageHeight - 100) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(chart.title, margin, yPosition);
      yPosition += 10;

      try {
        doc.addImage(chart.dataUrl, "PNG", margin, yPosition, contentWidth, 80);
        yPosition += 90;
      } catch (error) {
        console.error("Error adding chart to PDF:", error);
      }
    }
  }

  // Footer on each page
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  doc.save(`${reportData.title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
}

export async function generateWord(reportData: ReportData): Promise<void> {
  const children: any[] = [];

  // Title
  children.push(
    new Paragraph({
      text: reportData.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    })
  );

  // Metadata
  if (reportData.metadata) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${new Date(reportData.metadata.generatedAt).toLocaleString()}`,
            size: 18,
            color: "666666",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Parse content by sections
  const sections = reportData.content.split("\n");

  for (const line of sections) {
    if (!line.trim()) {
      children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
      continue;
    }

    // Main headers (##)
    if (line.startsWith("##")) {
      children.push(
        new Paragraph({
          text: line.replace(/^##\s*/, ""),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 },
        })
      );
      continue;
    }

    // Subheaders (###)
    if (line.startsWith("###")) {
      children.push(
        new Paragraph({
          text: line.replace(/^###\s*/, ""),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 150 },
        })
      );
      continue;
    }

    // Bullet points
    if (line.startsWith("-") || line.startsWith("*")) {
      children.push(
        new Paragraph({
          text: line.replace(/^[-*]\s*/, ""),
          bullet: { level: 0 },
          spacing: { after: 100 },
        })
      );
      continue;
    }

    // Regular paragraphs
    children.push(
      new Paragraph({
        text: line,
        spacing: { after: 150 },
      })
    );
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  // Generate and save
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${reportData.title.replace(/\s+/g, "_")}_${Date.now()}.docx`);
}

export async function captureChartAsImage(chartElement: HTMLElement): Promise<string> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(chartElement, {
    backgroundColor: "#ffffff",
    scale: 2,
  });
  return canvas.toDataURL("image/png");
}
