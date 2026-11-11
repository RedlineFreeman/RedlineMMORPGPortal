import React, { useEffect, useRef } from 'react';
import { Season } from '../types';

interface SeasonWeatherOverlayProps {
  season: Season;
  isEnabled: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  color: string;
}

export const SeasonWeatherOverlay: React.FC<SeasonWeatherOverlayProps> = ({ season, isEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = season === 'winter' ? 70 : season === 'autumn' ? 35 : season === 'spring' ? 30 : 25;
    const particles: Particle[] = [];

    const getParticleColor = () => {
      if (season === 'winter') {
        return 'rgba(255, 255, 255, ';
      }
      if (season === 'autumn') {
        const colors = [
          'rgba(217, 119, 6, ', // amber
          'rgba(180, 83, 9, ',  // dark amber
          'rgba(225, 29, 72, ', // crimson
          'rgba(234, 179, 8, ', // gold
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      if (season === 'spring') {
        const colors = [
          'rgba(251, 207, 232, ', // pink
          'rgba(244, 114, 182, ', // rose
          'rgba(187, 247, 208, ', // light green
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
      // Summer fireflies
      return 'rgba(250, 204, 21, ';
    };

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: season === 'winter' ? Math.random() * 3 + 1.5 : Math.random() * 6 + 5,
        speedY: season === 'summer' ? (Math.random() - 0.5) * 0.8 : Math.random() * 1.5 + 0.6,
        speedX: (Math.random() - 0.5) * 1.2,
        opacity: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 2,
        color: getParticleColor(),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        // Wrap around borders
        if (p.y > height) {
          p.y = -10;
          p.x = Math.random() * width;
        } else if (p.y < -10) {
          p.y = height + 5;
        }

        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (season === 'winter') {
          // Soft circular snowflakes
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.shadowBlur = 4;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        } else if (season === 'autumn') {
          // Oval leaf shape with veins
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        } else if (season === 'spring') {
          // Flower petals
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.8, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity})`;
          ctx.fill();
        } else {
          // Summer Fireflies (pulsing glowing orbs)
          const pulse = Math.sin(Date.now() * 0.003 + p.x) * 0.3 + 0.7;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${p.opacity * pulse})`;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(250, 204, 21, 0.9)';
          ctx.fill();
        }

        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [season, isEnabled]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
