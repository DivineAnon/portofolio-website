import { useEffect, useRef, useState } from "react";
import { 
  ArrowUpRight, Download, Eye, Sparkles, MessageSquare, Terminal, RefreshCw, Smartphone, Play, ExternalLink
} from "lucide-react";
import { UserProfile } from "../types/portfolio";
import { useRenderTracker } from "../hooks/useRenderTracker";

interface HeroProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  setActiveSection: (sec: string) => void;
  language: "EN" | "ID";
  setLanguage: (lang: "EN" | "ID") => void;
  triggerEasterEgg: () => void;
}

export default function Hero({
  userProfile,
  addXP,
  setActiveSection,
  language,
  setLanguage,
  triggerEasterEgg
}: HeroProps) {
  useRenderTracker("hero");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [typingText, setTypingText] = useState("");
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [compileStatus, setCompileStatus] = useState<"idle" | "compiling" | "success">("idle");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [selectedSphereMode, setSelectedSphereMode] = useState<"ai" | "nodes" | "dna">("ai");

  const words = [
    "Lead Software Engineer",
    "Microservice Architect",
    "Full-Stack Developer",
    "AWS Cloud Architect"
  ];

  // Dynamic Typing Animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIdx];
    
    const tick = () => {
      if (!isDeleting) {
        setTypingText(currentWord.substring(0, typingText.length + 1));
        if (typingText === currentWord) {
          timer = setTimeout(() => setIsDeleting(true), 1500); // Wait 1.5s
          return;
        }
      } else {
        setTypingText(currentWord.substring(0, typingText.length - 1));
        if (typingText === "") {
          setIsDeleting(false);
          setCurrentWordIdx((currentWordIdx + 1) % words.length);
        }
      }
    };

    timer = setTimeout(tick, isDeleting ? 40 : 80);
    return () => clearTimeout(timer);
  }, [typingText, isDeleting, currentWordIdx]);

  // Interactive 3D Technology Sphere Canvas Math (Simulating Three.js directly on a lightweight 2D canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = 450);
    let height = (canvas.height = 450);
    let animationId: number;

    const points: { x: number; y: number; z: number; color: string; size?: number }[] = [];
    const sphereRadius = 140;
    const numPoints = 180;

    // Create a fibonacci sphere
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = sphereRadius * Math.cos(phi);

      const color = i % 3 === 0 ? "rgba(6, 182, 212, 0.7)" : i % 3 === 1 ? "rgba(37, 99, 235, 0.7)" : "rgba(192, 132, 252, 0.7)";
      points.push({ x, y, z, color });
    }

    let angleX = 0.005;
    let angleY = 0.005;

    // Mouse drag rotation controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      angleY = deltaX * 0.005;
      angleX = deltaY * 0.005;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Rotate around axes based on angleX and angleY
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      points.forEach((p) => {
        // Rotate Y
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate X
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        // Perspective projection
        const scale = 300 / (300 + p.z);
        const projX = p.x * scale;
        const projY = p.y * scale;

        // Only draw front points darker, back lighter (depth cue)
        const alpha = Math.max(0.15, (p.z + sphereRadius) / (2 * sphereRadius));
        const finalSize = Math.max(1, p.size ? p.size : 2 * scale);

        ctx.beginPath();
        if (selectedSphereMode === "ai") {
          ctx.arc(projX, projY, finalSize * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color.replace("0.7", alpha.toString());
          ctx.fill();
        } else if (selectedSphereMode === "nodes") {
          // Draw connecting webs between adjacent points
          ctx.arc(projX, projY, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${alpha})`;
          ctx.fill();
        } else {
          // Draw helical coils/dna spirals
          const r = Math.sin(p.y * 0.05) * 5;
          ctx.arc(projX + r, projY, finalSize, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
          ctx.fill();
        }
      });

      // Slowly damp the user drag rotation back to automated spinning
      if (!isDragging) {
        angleX += (0.002 - angleX) * 0.05;
        angleY += (0.003 - angleY) * 0.05;
      }

      // Draw interactive holographic radar circles
      ctx.strokeStyle = "rgba(6, 182, 212, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius + 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(37, 99, 235, 0.05)";
      ctx.beginPath();
      ctx.arc(0, 0, sphereRadius + 40, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [selectedSphereMode]);

  const runBuildCompilerSim = () => {
    if (compileStatus !== "idle") return;
    setCompileStatus("compiling");
    setTerminalOutput([
      "Initializing microservice pipeline...",
      "Fetching IDSTAR API endpoints...",
      "Validating JWT security parameters..."
    ]);

    const steps = [
      "Loading Laravel router configuration... [OK]",
      "Compiling Redis tagging triggers... [OK]",
      "Pinging Google Gemini models... Ready",
      "Building production static nodes... Complete",
      "Deploying Docker container clusters... Success!"
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setTerminalOutput(prev => [...prev, step]);
        if (idx === steps.length - 1) {
          setCompileStatus("success");
          addXP(100, "Successfully compiled Andrianus's live codebase.");
        }
      }, (idx + 1) * 700);
    });
  };

  // Automated trigger to download simulated CV
  const triggerResumeDownload = () => {
    const markdownResume = `
# ANDRIANUS MARIA
*Lead Full-Stack Engineer & Cloud Architect*
Email: andrianus.maria@idstar.group | Website: https://andrianus.web.id

## SUMMARY
Lead Developer with over 7 years of full-stack engineering expertise scaling web infrastructures, Docker/K8s environments, and real-time Kafka messaging platforms.

## CORE SKILLS
- PHP (Laravel 12+), Node.js (TypeScript), Python, Go
- React 19, Next.js 15, Vue.js, Tailwind v4
- Docker, Kubernetes, AWS Services (ECS, EKS, Lambda, S3)
- PostgreSQL, MySQL, Redis, Kafka queues

## KEY EXPERIENCE
1. Lead Full-Stack Engineer @ IDSTAR Group (2023 - Present)
2. Senior Software Engineer @ TechCorp Indonesia (2020 - 2023)
3. Full Stack Web Developer @ Global Solutions (2018 - 2020)

## EDUCATION
B.S. in Computer Science - Universitas Indonesia (2014 - 2018)
    `;
    const blob = new Blob([markdownResume], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "andrianus_maria_resume.md";
    link.click();
    URL.revokeObjectURL(url);
    addXP(50, "Downloaded CV Markdown.");
  };

  return (
    <div className="py-8 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
      
      {/* Easter Egg Trigger bug */}
      <button 
        onClick={triggerEasterEgg}
        className="absolute bottom-2 right-4 text-[10px] font-mono text-slate-800 hover:text-red-500/40 select-none z-50 cursor-pointer"
        id="bug-easter-egg"
      >
        &#x1F41B; debug_leak.sh
      </button>

      {/* Left Column: Visual Typography and Controls */}
      <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-500">
        
        {/* Futuristic Badge */}
        <div className="inline-flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/25 px-4 py-1.5 rounded-full text-xs font-mono text-cyan-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span className="font-bold tracking-widest uppercase">
            {language === "EN" ? "SYSTEM ON // PIPELINE ACTIVE" : "SISTEM AKTIF // JALUR ONLINE"}
          </span>
        </div>

        {/* Large Bold Display Typography */}
        <div className="space-y-4">
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white tracking-tight leading-none">
            {language === "EN" ? "Hi, I am" : "Halo, Saya"}{" "}
            <span className="text-gradient font-sora block mt-2">
              Andrianus Maria
            </span>
          </h1>
          <div className="h-10 flex items-center">
            <span className="font-mono text-cyan-400 font-semibold text-lg sm:text-xl md:text-2xl border-r-2 border-cyan-400 pr-1 animate-pulse">
              {typingText}
            </span>
          </div>
        </div>

        {/* Short Executive Summary */}
        <p className="text-slate-400 font-sans leading-relaxed max-w-xl text-sm sm:text-base">
          {language === "EN"
            ? "Senior software engineer designing robust microservices, micro-architectures, and blazing fast caching layers. I lead teams translating heavy enterprise concepts into beautiful, seamless user experiences."
            : "Senior software engineer berpengalaman merancang sistem microservices, infrastruktur cloud, dan caching performa tinggi. Saya memimpin tim mewujudkan konsep enterprise menjadi aplikasi yang indah dan responsif."}
        </p>

        {/* Call To Actions */}
        <div className="flex flex-wrap gap-4 items-center">
          <button
            onClick={() => {
              setActiveSection("portfolio");
              addXP(20, "Navigated to Projects from Hero.");
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-sora font-semibold text-sm shadow-xl shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 group cursor-pointer"
          >
            <span>{language === "EN" ? "Explore Systems" : "Lihat Proyek"}</span>
            <Eye className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => setActiveSection("fun-zone")}
            className="px-6 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-300 font-sora font-semibold text-sm hover:border-cyan-500/30 hover:text-white transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
            <span>{language === "EN" ? "Developer Quest" : "Misi Pengembang"}</span>
          </button>

          <button
            onClick={triggerResumeDownload}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 font-mono text-xs hover:text-white hover:border-cyan-400/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV.MD</span>
          </button>
        </div>

        {/* Dynamic Interactive Compiler Console Code box */}
        <div className="glass-panel rounded-xl p-4 border border-white/5 shadow-inner max-w-xl font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-slate-500">
            <span className="flex items-center space-x-1">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
              <span className="ml-2">andrianus_compiler.sh</span>
            </span>
            <span className="text-[10px] text-cyan-400/60 uppercase">Node Host Vite</span>
          </div>

          {compileStatus === "idle" && (
            <div className="text-center py-6">
              <p className="text-slate-400 mb-4 text-[11px]">
                {language === "EN" ? "Connect cluster and build source nodes." : "Koneksikan cluster dan build kode sumber."}
              </p>
              <button
                onClick={runBuildCompilerSim}
                className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/20 active:scale-95 transition-all text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>BUILD CODEBASE</span>
              </button>
            </div>
          )}

          {compileStatus === "compiling" && (
            <div className="space-y-1.5 text-slate-300 select-none">
              {terminalOutput.map((out, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span className="text-cyan-400">&gt;</span>
                  <span>{out}</span>
                </div>
              ))}
              <div className="flex items-center space-x-2 text-cyan-400">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="animate-pulse">Processing compilation matrix...</span>
              </div>
            </div>
          )}

          {compileStatus === "success" && (
            <div className="space-y-2 text-green-400 select-none">
              <div className="flex items-center space-x-2">
                <span>[✓]</span>
                <span>Compile success! 0 errors, 2 warnings.</span>
              </div>
              <p className="text-slate-400 text-[10px]">
                System metrics: Lighthouse score averages 98%, SEO 100%, Core Web Vitals fully optimized.
              </p>
              <button
                onClick={() => setCompileStatus("idle")}
                className="text-[10px] text-cyan-400 underline hover:text-cyan-300"
              >
                Recompile compiler
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Holographic Three.js-Like Canvas Sphere */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center animate-in fade-in slide-in-from-right duration-500">
        <div className="relative glass-panel rounded-3xl p-4 border border-white/10 shadow-2xl overflow-hidden group">
          
          {/* Sphere Modes Selector tabs */}
          <div className="absolute top-4 left-4 right-4 flex bg-slate-950/80 rounded-lg p-1 border border-white/5 z-10 text-[10px] font-mono">
            {(["ai", "nodes", "dna"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedSphereMode(m)}
                className={`flex-1 py-1.5 rounded uppercase font-bold text-center tracking-wider transition-all ${
                  selectedSphereMode === m 
                    ? "bg-cyan-500/15 text-cyan-400" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {m} model
              </button>
            ))}
          </div>

          {/* Interactive Sphere canvas */}
          <canvas 
            ref={canvasRef} 
            className="block cursor-grab active:cursor-grabbing hover:scale-[1.02] transition-transform duration-300"
          />

          {/* Glowing bottom status lines */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase select-none">
            <span>DRAG SPHERE TO ROTATE</span>
            <span className="text-cyan-400">RENDER: CANVAS_2D_HOLO</span>
          </div>
        </div>

        {/* Small floating specs under the hologram */}
        <div className="flex space-x-4 mt-6 text-[10px] font-mono text-slate-500">
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
            <span>KAFKA BUFFERS</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            <span>DOCKER BUILDS</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            <span>GEMINI CORES</span>
          </div>
        </div>
      </div>
    </div>
  );
}
