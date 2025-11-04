import { useEffect, useRef } from 'react';

export const FluidGradientBackground = () => {
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
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'rgba(11, 14, 19, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      // Draw flowing gradient waves
      for (let i = 0; i < 3; i++) {
        const gradient = ctx.createRadialGradient(
          mouseX + Math.sin(time + i) * 100,
          mouseY + Math.cos(time + i) * 100,
          0,
          mouseX + Math.sin(time + i) * 100,
          mouseY + Math.cos(time + i) * 100,
          300 + i * 100
        );

        const colors = [
          ['rgba(0, 229, 255, 0.15)', 'rgba(0, 229, 255, 0)'],
          ['rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0)'],
          ['rgba(0, 229, 255, 0.08)', 'rgba(99, 102, 241, 0)']
        ];

        gradient.addColorStop(0, colors[i][0]);
        gradient.addColorStop(1, colors[i][1]);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};