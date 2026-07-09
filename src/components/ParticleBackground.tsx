import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  theme?: "cyberpunk" | "navy" | "green";
}

export default function ParticleBackground({ theme = "cyberpunk" }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const count = Math.min(Math.floor((width * height) / 15000), 100);

    const mouse = {
      x: null as number | null,
      y: null as number | null,
      radius: 180,
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2.5 + 0.5;
        
        // Dynamically assign theme specific color accents
        if (theme === "green") {
          this.color = Math.random() > 0.5 ? "rgba(16, 185, 129, 0.4)" : "rgba(132, 204, 22, 0.4)";
        } else if (theme === "navy") {
          this.color = Math.random() > 0.5 ? "rgba(59, 130, 246, 0.4)" : "rgba(236, 72, 153, 0.4)";
        } else {
          this.color = Math.random() > 0.5 ? "rgba(6, 182, 212, 0.4)" : "rgba(37, 99, 235, 0.4)";
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundary
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Interactivity with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const fontDist = Math.sqrt(dx * dx + dy * dy);

          if (fontDist < mouse.radius) {
            const force = (mouse.radius - fontDist) / mouse.radius;
            this.x -= (dx / fontDist) * force * 1.5;
            this.y -= (dy / fontDist) * force * 1.5;
          }
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Draw connected tech lines with theme matched colors
    function drawConnections(c: CanvasRenderingContext2D) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = ((120 - dist) / 120) * 0.15;
            let lineColor = `rgba(6, 182, 212, ${alpha})`;
            if (theme === "green") {
              lineColor = `rgba(16, 185, 129, ${alpha})`;
            } else if (theme === "navy") {
              lineColor = `rgba(59, 130, 246, ${alpha})`;
            }

            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);
            c.strokeStyle = lineColor;
            c.lineWidth = 0.6;
            c.stroke();
          }
        }
      }
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw subtle background matching selected theme
      let bgFill = "rgba(5, 5, 5, 1)";
      if (theme === "green") {
        bgFill = "rgba(2, 7, 3, 1)";
      } else if (theme === "navy") {
        bgFill = "rgba(6, 11, 25, 1)";
      }
      ctx.fillStyle = bgFill;
      ctx.fillRect(0, 0, width, height);

      // Tech grid effect
      ctx.strokeStyle = "rgba(255, 255, 255, 0.01)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw particles
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      drawConnections(ctx);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Event listeners
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-20"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
