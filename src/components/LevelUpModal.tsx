import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Award, ArrowUpRight, CheckCircle } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  rank: string;
  oldLevel: number;
  recentMilestones: string[];
}

export default function LevelUpModal({
  isOpen,
  onClose,
  level,
  rank,
  oldLevel,
  recentMilestones
}: LevelUpModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play a celebratory retro synth level up arpeggio
  useEffect(() => {
    if (isOpen) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const now = ctx.currentTime;
          
          // Arpeggio notes: C4 -> E4 -> G4 -> C5 -> E5 -> G5 -> C6
          const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
          
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            // Alternating types for cyber-synth feel
            osc.type = idx % 2 === 0 ? "sine" : "triangle";
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            
            // Slight pitch slide up at the end
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + idx * 0.08 + 0.2);
            
            gain.gain.setValueAtTime(0, now + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.35);
          });
        }
      } catch (e) {
        console.warn("Celebration AudioContext chime failed:", e);
      }
    }
  }, [isOpen]);

  // Particle explosion effect
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      shape: "circle" | "square" | "triangle" | "star" | "code";
      text?: string;
      rotation: number;
      spin: number;
    }

    const particles: Particle[] = [];
    const colors = [
      "#06b6d4", // Cyan
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#3b82f6", // Blue
      "#ec4899", // Pink
      "#a855f7"  // Purple
    ];
    const shapes: Particle["shape"][] = ["circle", "square", "triangle", "star", "code"];
    const codeSnippets = ["{xp++}", "101", "Level++", "OK", "SYS", "API", "CPU", "++"];

    // Spawn burst
    const spawnX = width / 2;
    const spawnY = height / 2;
    
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      const size = Math.random() * 6 + 3;
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const text = shape === "code" ? codeSnippets[Math.floor(Math.random() * codeSnippets.length)] : undefined;
      
      particles.push({
        x: spawnX,
        y: spawnY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 2), // upward bias
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        shape,
        text,
        rotation: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.1
      });
    }

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // gravity
        p.vx *= 0.98; // friction
        p.rotation += p.spin;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.5;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "square") {
          ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
        } else if (p.shape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, p.size);
          ctx.lineTo(-p.size, p.size);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === "star") {
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            ctx.lineTo(Math.cos(((18 + j * 72) * Math.PI) / 180) * p.size * 2, Math.sin(((18 + j * 72) * Math.PI) / 180) * p.size * 2);
            ctx.lineTo(Math.cos(((54 + j * 72) * Math.PI) / 180) * p.size, Math.sin(((54 + j * 72) * Math.PI) / 180) * p.size);
          }
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === "code" && p.text) {
          ctx.font = `bold ${p.size * 2 + 6}px "JetBrains Mono", monospace`;
          ctx.fillText(p.text, -p.size, p.size / 2);
        }

        ctx.restore();
      }

      // Add a couple of residual trail sparks
      if (Math.random() < 0.2 && particles.length < 150) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * 40,
          y: height / 2 + (Math.random() - 0.5) * 40,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          decay: 0.02,
          shape: "circle",
          rotation: 0,
          spin: 0
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Particle Explosion Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10 w-full h-full"
          />

          {/* Celebratory Dialog Card */}
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 350 } }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative z-20 w-full max-w-lg bg-slate-950 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gradient-to-b from-amber-500/20 to-cyan-500/0 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Glowing Top Badge */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                {/* Spin or float animation ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full blur-md opacity-75 animate-pulse" />
                <div className="relative bg-slate-900 border-2 border-amber-400 p-4 rounded-full shadow-lg">
                  <Award className="w-10 h-10 text-amber-400 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono font-extrabold text-amber-400 tracking-[0.25em] uppercase bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  SYSTEM LEVEL UP SECURED
                </span>
                <h2 className="text-3xl font-display font-extrabold text-white tracking-tight pt-1">
                  Level {level} Reached!
                </h2>
              </div>

              {/* Rank Badge */}
              <div className="bg-slate-900/90 border border-cyan-500/20 px-4 py-2.5 rounded-2xl w-full max-w-xs shadow-md shadow-cyan-950/20">
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">New Core Rank Assigned</div>
                <div className="text-sm font-mono font-bold text-cyan-400 flex items-center justify-center gap-1.5 mt-0.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {rank}
                </div>
              </div>

              {/* Contribution summary terminal block */}
              <div className="w-full space-y-2.5 text-left pt-2">
                <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 uppercase tracking-wider pl-1">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Milestone Contribution Log</span>
                </div>
                
                <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2.5 max-h-40 overflow-y-auto custom-scrollbar shadow-inner">
                  {recentMilestones && recentMilestones.length > 0 ? (
                    recentMilestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{milestone}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">Accelerated cognitive system nodes to Level {level}</span>
                    </div>
                  )}
                  
                  {/* Default milestones always present to make it look full and technical */}
                  <div className="flex items-start space-x-2 text-slate-400">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Synchronized memory profile onto persistent local storage engine</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-400">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>Enhanced core rank privileges and diagnostic telemetry access</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full pt-4">
                <button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-mono font-extrabold text-xs tracking-widest py-3.5 px-6 rounded-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>SECURE TELEMETRY LOG</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-950" />
                </button>
                <p className="text-[10px] text-slate-500 font-mono mt-2">
                  System logs generated securely on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
