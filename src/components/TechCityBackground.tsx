'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface CityBuilding {
  x: number;
  width: number;
  height: number;
  windows: boolean[];
}

export function TechCityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    let buildings: CityBuilding[] = [];
    let time = 0;
    let isMobile = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      isMobile = window.innerWidth < 768;
      initStars();
      initBuildings();
      initParticles();
    };

    const initStars = () => {
      stars = [];
      // 移动端减少星星数量
      const divisor = isMobile ? 6000 : 3000;
      const starCount = Math.floor((canvas.width * canvas.height) / divisor);
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.6,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    const initBuildings = () => {
      buildings = [];
      const buildingCount = Math.floor(canvas.width / (isMobile ? 60 : 40));
      let x = 0;
      
      for (let i = 0; i < buildingCount; i++) {
        const width = 30 + Math.random() * 50;
        const height = 80 + Math.random() * 200;
        const windowRows = Math.floor(height / 20);
        const windowCols = Math.floor(width / 15);
        const windows: boolean[] = [];
        
        for (let j = 0; j < windowRows * windowCols; j++) {
          windows.push(Math.random() > 0.3);
        }
        
        buildings.push({ x, width, height, windows });
        x += width + Math.random() * 20;
      }
    };

    const initParticles = () => {
      particles = [];
      // 移动端大幅减少粒子数量
      const divisor = isMobile ? 60000 : 20000;
      const particleCount = Math.floor((canvas.width * canvas.height) / divisor);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3 - 0.1,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.4 + 0.1,
          hue: 260 + Math.random() * 40,
        });
      }
    };

    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0d0a1a');
      gradient.addColorStop(0.3, '#1a1025');
      gradient.addColorStop(0.6, '#150d20');
      gradient.addColorStop(1, '#0a0610');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const drawStars = () => {
      stars.forEach(star => {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.3 + 0.7;
        const currentOpacity = star.opacity * twinkle;
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.fill();
        
        // 大星星加光晕（移动端跳过以节省性能）
        if (!isMobile && star.size > 1.5) {
          const glow = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, star.size * 4
          );
          glow.addColorStop(0, `rgba(200, 180, 255, ${currentOpacity * 0.3})`);
          glow.addColorStop(1, 'rgba(200, 180, 255, 0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });
    };

    const drawCity = () => {
      const groundY = canvas.height * 0.85;
      
      buildings.forEach(building => {
        if (building.x > canvas.width + 50) return;
        
        const buildingY = groundY - building.height;
        
        ctx.fillStyle = '#0a0510';
        ctx.fillRect(building.x, buildingY, building.width, building.height);
        
        ctx.strokeStyle = 'rgba(100, 50, 150, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(building.x, buildingY, building.width, building.height);
        
        const windowRows = Math.floor(building.height / 20);
        const windowCols = Math.floor(building.width / 15);
        const windowWidth = 8;
        const windowHeight = 12;
        
        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            const windowIndex = row * windowCols + col;
            if (building.windows[windowIndex]) {
              const wx = building.x + 5 + col * 15;
              const wy = buildingY + 5 + row * 20;
              
              // 移动端跳过窗户发光效果以节省性能
              if (!isMobile) {
                const windowGlow = ctx.createRadialGradient(
                  wx + windowWidth / 2, wy + windowHeight / 2, 0,
                  wx + windowWidth / 2, wy + windowHeight / 2, 15
                );
                windowGlow.addColorStop(0, 'rgba(255, 200, 100, 0.3)');
                windowGlow.addColorStop(1, 'rgba(255, 200, 100, 0)');
                ctx.fillStyle = windowGlow;
                ctx.fillRect(wx - 5, wy - 5, windowWidth + 10, windowHeight + 10);
              }
              
              const flicker = Math.random() > 0.99 ? 0.5 : 1;
              ctx.fillStyle = `rgba(255, 220, 150, ${0.8 * flicker})`;
              ctx.fillRect(wx, wy, windowWidth, windowHeight);
            }
          }
        }
      });
      
      const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
      groundGradient.addColorStop(0, 'rgba(50, 20, 80, 0.5)');
      groundGradient.addColorStop(1, 'rgba(10, 5, 20, 0.8)');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
    };

    const drawParticles = () => {
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
        
        // 移动端跳过粒子光晕以节省性能
        if (!isMobile) {
          const glow = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 3
          );
          glow.addColorStop(0, `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.3})`);
          glow.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }
      });
      
      // 移动端跳过粒子连线（O(n²) 复杂度，非常耗性能）
      if (!isMobile) {
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(150, 100, 200, ${0.1 * (1 - dist / 100)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      }
    };

    let lastFrameTime = 0;
    const targetFPS = isMobile ? 24 : 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp: number) => {
      // 移动端降帧以节省性能
      if (isMobile) {
        const delta = timestamp - lastFrameTime;
        if (delta < frameInterval) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = timestamp;
      }
      
      time++;
      
      drawBackground();
      drawStars();
      drawCity();
      drawParticles();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: '#0d0a1a' }}
    />
  );
}
