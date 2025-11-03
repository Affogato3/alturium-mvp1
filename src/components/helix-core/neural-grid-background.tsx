import { useEffect, useRef } from 'react';

export const NeuralGridBackground = () => {
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
    const gridSize = 50;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += 0.001;

      // Draw grid with perspective
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const wave = Math.sin(x * 0.01 + time * 2) * Math.cos(y * 0.01 + time * 2);
          const alpha = (wave + 1) * 0.05;
          
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

      // Sonar pulses
      const pulseX = canvas.width / 2;
      const pulseY = canvas.height / 2;
      const pulseRadius = (time * 200) % 500;
      
      ctx.beginPath();
      ctx.arc(pulseX, pulseY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0, 230, 246, ${1 - pulseRadius / 500})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20"
      style={{ zIndex: 1 }}
    />
  );
};
