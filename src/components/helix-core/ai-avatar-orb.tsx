import { useEffect, useRef, useState } from "react";

type AvatarState = 'idle' | 'analyzing' | 'active';

export const AIAvatarOrb = ({ state = 'idle' }: { state?: AvatarState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulseSize, setPulseSize] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 80;
    canvas.height = 80;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      time += state === 'analyzing' ? 0.08 : 0.02;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Core sphere
      const baseRadius = state === 'analyzing' ? 25 : state === 'active' ? 28 : 22;
      const radius = baseRadius + Math.sin(time) * (state === 'analyzing' ? 5 : 2);
      
      // Outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 2);
      gradient.addColorStop(0, 'rgba(0, 230, 246, 0.4)');
      gradient.addColorStop(0.5, 'rgba(0, 230, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 230, 246, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Core sphere with particles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const particleRadius = radius * 0.8;
        const x = centerX + Math.cos(angle) * particleRadius;
        const y = centerY + Math.sin(angle) * particleRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 230, 246, 0.8)';
        ctx.fill();
      }
      
      // Inner core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      coreGradient.addColorStop(0, 'rgba(0, 230, 246, 0.8)');
      coreGradient.addColorStop(0.7, 'rgba(0, 230, 246, 0.4)');
      coreGradient.addColorStop(1, 'rgba(0, 230, 246, 0.1)');
      
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      setPulseSize(1 + Math.sin(time) * 0.1);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [state]);

  const getStateLabel = () => {
    switch (state) {
      case 'analyzing': return 'Analyzing...';
      case 'active': return 'Active';
      default: return 'Idle';
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2">
      <div style={{ transform: `scale(${pulseSize})` }} className="transition-transform">
        <canvas ref={canvasRef} className="rounded-full" />
      </div>
      <span className="text-xs text-primary font-medium">{getStateLabel()}</span>
    </div>
  );
};
