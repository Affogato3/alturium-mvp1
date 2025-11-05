import { useEffect, useRef } from 'react';

export const NeuralFabricBackground = ({ intensity = 1 }: { intensity?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    const gridSize = 80;
    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];

    // Create neural nodes
    for (let i = 0; i < 30; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 11, 13, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.001 * intensity;

      // Draw grid lines with wave effect
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const wave = Math.sin(x * 0.005 + time * 2) * Math.cos(y * 0.005 + time * 2);
          const alpha = (wave + 1) * 0.02 * intensity;

          ctx.strokeStyle = `rgba(0, 230, 246, ${alpha})`;
          ctx.lineWidth = 0.5;

          // Vertical lines
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + gridSize);
          ctx.stroke();

          // Horizontal lines
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + gridSize, y);
          ctx.stroke();
        }
      }

      // Update and draw neural nodes
      nodes.forEach((node, i) => {
        node.x += node.vx * intensity;
        node.y += node.vy * intensity;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
        gradient.addColorStop(0, 'rgba(0, 230, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 230, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections between nearby nodes
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = otherNode.x - node.x;
          const dy = otherNode.y - node.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const alpha = (1 - distance / 200) * 0.2 * intensity;
            ctx.strokeStyle = `rgba(0, 230, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.stroke();
          }
        });
      });

      // Sonar pulse effect
      const pulseX = canvas.width / 2;
      const pulseY = canvas.height / 2;
      const pulseRadius = (time * 150 * intensity) % 600;

      ctx.beginPath();
      ctx.arc(pulseX, pulseY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 230, 246, ${(1 - pulseRadius / 600) * 0.15 * intensity})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};