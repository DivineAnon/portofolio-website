import React, { useState, useEffect, useRef } from "react";
import { 
  Trophy, Award, RefreshCw, Key, ShieldAlert, CheckCircle, HelpCircle, Flame, Gamepad2, Brain, Play, RotateCcw, ChevronRight, CheckSquare, Zap, Layers, GitBranch, KeyRound, Clock
} from "lucide-react";
import { UserProfile, Badge, Mission } from "../types/portfolio";
import { 
  TRIVIA_QUESTIONS, BUG_HUNTER_QUESTIONS, CODE_PUZZLE_QUESTIONS, GUESS_LANG_QUESTIONS 
} from "../data/portfolioData";
import { useRenderTracker } from "../hooks/useRenderTracker";

interface FunZoneProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
  unlockBadge: (badgeId: string, badgeTitle: string, description: string, icon: string, color: string) => void;
  activeMissions: Mission[];
  completeMission: (id: string) => void;
  dailyMissions: Mission[];
  nextResetTime: number;
  triggerManualReset: () => void;
}

export default function FunZone({
  userProfile,
  addXP,
  language,
  unlockBadge,
  activeMissions,
  completeMission,
  dailyMissions,
  nextResetTime,
  triggerManualReset
}: FunZoneProps) {
  useRenderTracker("fun-zone");
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!nextResetTime) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = nextResetTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      const hStr = String(hours).padStart(2, "0");
      const mStr = String(minutes).padStart(2, "0");
      const sStr = String(seconds).padStart(2, "0");

      setTimeLeft(`${hStr}:${mStr}:${sStr}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextResetTime]);

  // General Quest Launcher Dashboard
  const gamesList = [
    { id: "snake", title: "Snake AI (Neon)", icon: <Gamepad2 className="w-5 h-5 text-green-400" />, desc: "High-speed neon snake. Dodge walls, grab coding nodes." },
    { id: "memory", title: "Memory Card Matrix", icon: <Layers className="w-5 h-5 text-blue-400" />, desc: "Pair programming language logos under time limits." },
    { id: "trivia", title: "Tech Trivia", icon: <Brain className="w-5 h-5 text-cyan-400" />, desc: "Test network, database & cloud infrastructure details." },
    { id: "bug-hunter", title: "Bug Hunter Cops", icon: <ShieldAlert className="w-5 h-5 text-red-400" />, desc: "Locate syntax errors in files within 30 seconds." },
    { id: "code-puzzle", title: "Code Assembly", icon: <GitBranch className="w-5 h-5 text-purple-400" />, desc: "Re-arrange code fragments into compiling pipelines." },
    { id: "escape-hacker", title: "Escape The Hacker", icon: <KeyRound className="w-5 h-5 text-yellow-500" />, desc: "Decrypt passcode strings and restore firewalls." }
  ];

  const handleGameSelect = (id: string) => {
    setActiveGame(id);
    completeMission("play-game");
    addXP(20, `Booted dev mini-game: ${id}`);
  };

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Developer Quest Zone" : "Misi Petualangan Pengembang"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "Gamified coding trials, logic audits & neon games" : "Uji coba logika coding, audit bug & game neon interaktif"}
        </p>
      </div>

      {/* Grid: Left Column (Active Missions / XP tracker) | Right Column (Interactive Mini Games) */}
      {activeGame === null ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Quest Missions list */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
              <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
                <Trophy className="w-5 h-5 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest">Active Missions</h3>
              </div>

              {/* Progress Bar Component for Total XP Earned vs Remaining */}
              {(() => {
                const totalXP = activeMissions.reduce((acc, m) => acc + m.xpReward, 0);
                const completedXP = activeMissions.filter(m => m.status === "completed").reduce((acc, m) => acc + m.xpReward, 0);
                const remainingXP = totalXP - completedXP;
                const completedCount = activeMissions.filter(m => m.status === "completed").length;
                const totalCount = activeMissions.length;
                const pct = totalXP > 0 ? (completedXP / totalXP) * 100 : 0;

                return (
                  <div className="bg-slate-950/60 border border-white/5 rounded-xl p-3.5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-wider">
                      <span className="text-green-400 font-bold">Earned: {completedXP} XP</span>
                      <span className="text-slate-500">Remaining: {remainingXP} XP</span>
                    </div>

                    <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/10 p-[2px]">
                      {/* Completed XP fill */}
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500 relative"
                        style={{ width: `${pct}%` }}
                      >
                        {/* Shimmer/Pulse effect on progress bar */}
                        <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{completedCount} of {totalCount} Missions Cleared</span>
                      <span className="font-bold text-white">{Math.round(pct)}% XP Secured</span>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-3.5">
                {activeMissions.map((m) => (
                  <div 
                    key={m.id} 
                    className={`p-3.5 rounded-xl border font-mono text-xs ${
                      m.status === "completed" 
                        ? "bg-green-500/10 border-green-500/20 text-green-400" 
                        : m.status === "locked"
                        ? "bg-slate-950/40 border-white/5 text-slate-600 opacity-60"
                        : "bg-slate-900/60 border-cyan-500/15 text-slate-300 shadow-md shadow-cyan-500/5"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1 font-bold">
                      <span className="flex items-center space-x-1.5">
                        <CheckSquare className={`w-3.5 h-3.5 ${m.status === "completed" ? "text-green-400" : "text-slate-500"}`} />
                        <span>{m.title}</span>
                      </span>
                      <span className="text-[10px] text-cyan-400">+{m.xpReward} XP</span>
                    </div>
                    <p className={`text-[10.5px] leading-relaxed mt-1 ${m.status === "completed" ? "text-slate-400" : "text-slate-400"}`}>
                      {m.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Missions Card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 shadow-lg shadow-cyan-500/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
                  <h3 className="font-display font-bold text-white text-sm uppercase tracking-widest">Daily Missions</h3>
                </div>
                {/* Reset Timer */}
                <div className="flex items-center space-x-1.5 font-mono text-[10px] text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-cyan-400 tracking-wider">{timeLeft || "24:00:00"}</span>
                </div>
              </div>

              <p className="text-slate-400 font-sans text-xs leading-normal">
                Generates unique developer tasks every 24 hours. Clear daily servers to secure extra XP.
              </p>

              {/* List of daily missions */}
              <div className="space-y-3">
                {dailyMissions && dailyMissions.length > 0 ? (
                  dailyMissions.map((m) => (
                    <div 
                      key={m.id} 
                      className={`p-3 rounded-xl border font-mono text-xs transition-all duration-300 ${
                        m.status === "completed" 
                          ? "bg-green-500/10 border-green-500/20 text-green-400" 
                          : "bg-slate-900/60 border-white/5 text-slate-300 hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1 font-bold">
                        <span className="flex items-center space-x-1.5">
                          <CheckSquare className={`w-3.5 h-3.5 ${m.status === "completed" ? "text-green-400" : "text-slate-500"}`} />
                          <span className={`${m.status === "completed" ? "line-through text-slate-500" : ""}`}>{m.title}</span>
                        </span>
                        <span className={`text-[10px] ${m.status === "completed" ? "text-slate-500" : "text-amber-400"}`}>+{m.xpReward} XP</span>
                      </div>
                      <p className={`text-[10.5px] leading-relaxed mt-1 ${m.status === "completed" ? "text-slate-500" : "text-slate-400"}`}>
                        {m.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500 font-mono text-xs">Generating cyber-missions...</div>
                )}
              </div>

              {/* Developer Reset / Reload Simulation Trigger */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={triggerManualReset}
                  className="text-[9px] font-mono text-slate-500 hover:text-cyan-400 transition-colors flex items-center space-x-1 cursor-pointer bg-white/5 px-2 py-1 rounded border border-white/5"
                  title="Simulate 24-hour date rollover to check unique generation logic"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>SIMULATE 24H RESET</span>
                </button>
              </div>
            </div>

            {/* XP progress panel card */}
            <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-3 font-mono text-xs text-slate-400">
              <div className="flex justify-between font-bold text-white text-[10px] uppercase tracking-widest">
                <span>Rank progression:</span>
                <span className="text-cyan-400">{userProfile.rank}</span>
              </div>
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden relative border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all"
                  style={{ width: `${(userProfile.xp % 1000) / 10}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px]">
                <span>Lvl {userProfile.level}</span>
                <span>{userProfile.xp % 1000} / 1000 XP to next level</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Game selector cards grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gamesList.map((g) => (
              <div
                key={g.id}
                onClick={() => handleGameSelect(g.id)}
                className="glass-panel rounded-2xl border border-white/5 hover:border-cyan-500/20 p-5 cursor-pointer flex items-start space-x-4 hover:scale-[1.01] transition-all relative overflow-hidden group"
              >
                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                  {g.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                    {g.title}
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {g.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Render Selected Active Game */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 font-mono text-xs">
            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl font-semibold cursor-pointer"
            >
              &larr; Return to Quest Launcher
            </button>
            <span className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse">
              GAME SYSTEM RUNNING
            </span>
          </div>

          <div className="max-w-xl mx-auto">
            {activeGame === "snake" && <NeonSnakeGame addXP={addXP} unlockBadge={unlockBadge} />}
            {activeGame === "memory" && <MemoryMatrixGame addXP={addXP} unlockBadge={unlockBadge} />}
            {activeGame === "trivia" && <TechTriviaGame addXP={addXP} unlockBadge={unlockBadge} />}
            {activeGame === "bug-hunter" && <BugHunterGame addXP={addXP} unlockBadge={unlockBadge} />}
            {activeGame === "code-puzzle" && <CodeAssemblyGame addXP={addXP} unlockBadge={unlockBadge} />}
            {activeGame === "escape-hacker" && <EscapeHackerGame addXP={addXP} unlockBadge={unlockBadge} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================================
   GAME MODULES IMPLEMENTATIONS
======================================= */

// 1. NEON SNAKE GAME MODULE
function NeonSnakeGame({ addXP, unlockBadge }: { addXP: any; unlockBadge: any }) {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameRunning, setGameRunning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Snake coordinates and velocities
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 }
  ]);
  const [direction, setDirection] = useState<{ x: number; y: number }>({ x: 0, y: -1 });
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 5, y: 5 });

  const startSnakeGame = () => {
    setScore(0);
    setGameOver(false);
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }]);
    setDirection({ x: 0, y: -1 });
    setFood({ x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19) });
    setGameRunning(true);
  };

  // Keyboard and Drawing effects
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gridSize = 20;
    const size = 400;
    canvas.width = size;
    canvas.height = size;

    const timeout = setTimeout(() => {
      if (snake.length === 0) return;

      const head = snake[0];
      const nextHead = {
        x: (head.x + direction.x + 20) % 20,
        y: (head.y + direction.y + 20) % 20
      };

      // Check self-collision
      const hasCollision = snake.some((p) => p.x === nextHead.x && p.y === nextHead.y);
      if (hasCollision) {
        setGameOver(true);
        setGameRunning(false);
        addXP(score * 5, "Finished Neon Snake game.");
        if (score >= 10) {
          unlockBadge("badge-neon-master", "Neon Snake Master", "Earned 10+ points in Snake AI.", "Gamepad2", "border-green-500 text-green-400");
        }
        return;
      }

      // Check food
      const isEaten = nextHead.x === food.x && nextHead.y === food.y;
      if (isEaten) {
        setScore((s) => s + 1);
        setFood({
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20)
        });
        setSnake((prev) => [nextHead, ...prev]);
      } else {
        setSnake((prev) => [nextHead, ...prev.slice(0, prev.length - 1)]);
      }
    }, 150);

    // Keyboard controls with scroll prevention
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp":
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Draw game loop
    ctx.clearRect(0, 0, size, size);
    
    // Draw grid background
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 0, size, size);

    // Draw snake body with glowing gradient
    snake.forEach((p, idx) => {
      ctx.fillStyle = idx === 0 ? "#06b6d4" : "#2563eb";
      ctx.fillRect(p.x * gridSize + 1, p.y * gridSize + 1, gridSize - 2, gridSize - 2);
    });

    // Draw glowing food node
    ctx.fillStyle = "#a78bfa";
    ctx.fillRect(food.x * gridSize + 1, food.y * gridSize + 1, gridSize - 2, gridSize - 2);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameRunning, snake, direction, food, gameOver, score, addXP, unlockBadge]);

  // Touch swipe detection handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    e.preventDefault(); // Lock the viewport to avoid page sliding during action swiping
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !gameRunning || gameOver) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30; // Minimum swipe distance in px

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipes
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
        } else {
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
        }
      }
    } else {
      // Vertical swipes
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
        } else {
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
        }
      }
    }
    touchStartRef.current = null;
  };

  // Virtual buttons handler
  const handleTouchDirection = (e: React.TouchEvent | React.MouseEvent, newDir: { x: number; y: number }) => {
    e.preventDefault();
    if (!gameRunning || gameOver) return;
    
    // Prevent self-reversing moves
    if (newDir.x !== 0 && direction.x === -newDir.x) return;
    if (newDir.y !== 0 && direction.y === -newDir.y) return;
    
    setDirection(newDir);
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 text-center space-y-4 font-mono text-xs select-none touch-none">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
        <span className="font-bold text-cyan-400">NEON SNAKE PIPELINE</span>
        <span className="text-white">SCORE: {score}</span>
      </div>

      {!gameRunning ? (
        <div className="py-12 bg-slate-950 rounded-xl space-y-4">
          <Gamepad2 className="w-12 h-12 text-green-400 mx-auto animate-pulse" />
          <p className="text-slate-400 text-[11px] px-4">
            Navigate with arrow keys, swipe inside canvas, or use the virtual controller on mobile to compile cache blocks.
          </p>
          <button
            onClick={startSnakeGame}
            className="px-6 py-2.5 bg-green-500/10 border border-green-500/30 text-green-400 font-bold rounded-xl hover:bg-green-500/20 active:scale-95 transition-all cursor-pointer"
          >
            {gameOver ? "RUN SYSTEM DIAGNOSTICS & PLAY AGAIN" : "INITIALIZE SNAKE SYSTEM"}
          </button>
          {gameOver && <p className="text-red-400 font-bold">GAME OVER // CONNECTION FAULT</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main game board */}
          <div 
            className="flex flex-col items-center justify-center bg-slate-950 p-2 border border-white/5 rounded-2xl relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <canvas 
              ref={canvasRef} 
              className="block rounded-lg shadow-2xl w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] aspect-square bg-slate-950 touch-none" 
            />
            
            <p className="text-[9px] text-slate-500 font-mono mt-2 hidden sm:block">
              Swipe inside canvas or use Arrow Keys to navigate
            </p>
            <p className="text-[9px] text-slate-500 font-mono mt-2 sm:hidden">
              Swipe inside canvas or use D-Pad below to navigate
            </p>
          </div>

          {/* Virtual neon cyberpunk touch controller */}
          <div className="flex flex-col items-center space-y-2 mt-4 sm:hidden">
            <div className="grid grid-cols-3 gap-2 w-44">
              <div />
              <button
                type="button"
                onTouchStart={(e) => handleTouchDirection(e, { x: 0, y: -1 })}
                onMouseDown={(e) => handleTouchDirection(e, { x: 0, y: -1 })}
                className={`h-12 w-12 flex items-center justify-center bg-slate-900 border rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                  direction.y === -1 
                    ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-cyan-950/20" 
                    : "border-white/10 text-slate-400 active:border-cyan-500/20 active:text-cyan-400"
                }`}
              >
                ▲
              </button>
              <div />

              <button
                type="button"
                onTouchStart={(e) => handleTouchDirection(e, { x: -1, y: 0 })}
                onMouseDown={(e) => handleTouchDirection(e, { x: -1, y: 0 })}
                className={`h-12 w-12 flex items-center justify-center bg-slate-900 border rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                  direction.x === -1 
                    ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-cyan-950/20" 
                    : "border-white/10 text-slate-400 active:border-cyan-500/20 active:text-cyan-400"
                }`}
              >
                ◀
              </button>
              <div className="h-12 w-12 flex items-center justify-center text-slate-600 font-mono text-[9px] font-bold">
                PAD
              </div>
              <button
                type="button"
                onTouchStart={(e) => handleTouchDirection(e, { x: 1, y: 0 })}
                onMouseDown={(e) => handleTouchDirection(e, { x: 1, y: 0 })}
                className={`h-12 w-12 flex items-center justify-center bg-slate-900 border rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                  direction.x === 1 
                    ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-cyan-950/20" 
                    : "border-white/10 text-slate-400 active:border-cyan-500/20 active:text-cyan-400"
                }`}
              >
                ▶
              </button>

              <div />
              <button
                type="button"
                onTouchStart={(e) => handleTouchDirection(e, { x: 0, y: 1 })}
                onMouseDown={(e) => handleTouchDirection(e, { x: 0, y: 1 })}
                className={`h-12 w-12 flex items-center justify-center bg-slate-900 border rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                  direction.y === 1 
                    ? "border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] bg-cyan-950/20" 
                    : "border-white/10 text-slate-400 active:border-cyan-500/20 active:text-cyan-400"
                }`}
              >
                ▼
              </button>
              <div />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. MEMORY CARD MATRIX GAME MODULE
function MemoryMatrixGame({ addXP, unlockBadge }: { addXP: any; unlockBadge: any }) {
  const [cards, setCards] = useState<{ id: number; symbol: string; matched: boolean; flipped: boolean }[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<any | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<any | null>(null);
  const [won, setWon] = useState(false);

  const symbols = ["PHP", "VUE", "REACT", "AWS", "DOCKER", "K8S"];

  const initMemoryGame = () => {
    const doubledSymbols = [...symbols, ...symbols].map((symbol, idx) => ({
      id: idx,
      symbol,
      matched: false,
      flipped: false
    }));

    // Shuffle
    const shuffled = doubledSymbols.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setTurns(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setWon(false);
  };

  const handleCardChoice = (card: any) => {
    if (choiceOne && choiceTwo) return;
    if (card.matched || card.flipped) return;

    setCards(prev => prev.map(c => c.id === card.id ? { ...c, flipped: true } : c));
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setTurns(prev => prev + 1);

      if (choiceOne.symbol === choiceTwo.symbol) {
        setCards(prev => prev.map(c => c.symbol === choiceOne.symbol ? { ...c, matched: true } : c));
        resetTurn();
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => c.id === choiceOne.id || c.id === choiceTwo.id ? { ...c, flipped: false } : c));
          resetTurn();
        }, 800);
      }
    }
  }, [choiceOne, choiceTwo]);

  // Handle victory check safely outside setCards state update
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched) && !won) {
      setWon(true);
      addXP(150, "Completed Memory Matrix game.");
      unlockBadge("badge-memory", "Matrix Code Breaker", "Cleared the logo memory puzzle.", "Layers", "border-blue-500 text-blue-400");
    }
  }, [cards, won, addXP, unlockBadge]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
        <span className="font-bold text-cyan-400">MEMORY LOGO MATRIX</span>
        <span className="text-white">TURNS: {turns}</span>
      </div>

      {won ? (
        <div className="py-12 bg-slate-950 rounded-xl space-y-4">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto animate-bounce" />
          <p className="text-green-400 font-bold uppercase tracking-widest">GRID ALIGNED // MEMORY SHIELDS ON</p>
          <button
            onClick={initMemoryGame}
            className="px-6 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold rounded-xl hover:bg-blue-500/20 transition-all cursor-pointer"
          >
            PLAY MATRIX AGAIN
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardChoice(card)}
              className={`h-16 rounded-xl border flex items-center justify-center font-bold text-[10px] cursor-pointer transition-all ${
                card.flipped || card.matched
                  ? "bg-blue-600/15 text-blue-400 border-blue-500/40"
                  : "bg-slate-950 text-slate-600 border-white/5 hover:border-white/10"
              }`}
            >
              {card.flipped || card.matched ? card.symbol : "??"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 3. TECH TRIVIA GAME MODULE
function TechTriviaGame({ addXP, unlockBadge }: { addXP: any; unlockBadge: any }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleTriviaAnswer = (opt: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);

    if (opt === TRIVIA_QUESTIONS[currentIdx].answer) {
      setScore(s => s + 1);
      addXP(40, "Correctly resolved tech trivia query.");
    }
  };

  const handleNextTrivia = () => {
    setSelectedOpt(null);
    if (currentIdx + 1 < TRIVIA_QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setFinished(true);
      if (score === TRIVIA_QUESTIONS.length) {
        unlockBadge("badge-intellect", "Grand Intellect Node", "Score 100% on Cloud Trivia.", "Brain", "border-cyan-500 text-cyan-400");
      }
    }
  };

  const restartTrivia = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setScore(0);
    setFinished(false);
  };

  const currentQ = TRIVIA_QUESTIONS[currentIdx];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
        <span className="font-bold text-cyan-400">COGNITIVE CLOUD TRIVIA</span>
        <span className="text-white">NODE {currentIdx + 1}/{TRIVIA_QUESTIONS.length}</span>
      </div>

      {finished ? (
        <div className="text-center py-10 space-y-4">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
          <p className="text-white font-bold text-sm uppercase">Diagnostics Complete</p>
          <p className="text-slate-400">Accuracy score: {score} / {TRIVIA_QUESTIONS.length} correctly mapped parameters.</p>
          <button
            onClick={restartTrivia}
            className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/20 font-bold"
          >
            RE-RUN TRIVIA CHECKS
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-white text-sm leading-relaxed">{currentQ.q}</p>
          <div className="space-y-2">
            {currentQ.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleTriviaAnswer(opt)}
                className={`w-full text-left p-3 rounded-xl border text-[11px] transition-all font-semibold cursor-pointer ${
                  selectedOpt === null
                    ? "bg-slate-950 border-white/5 hover:border-cyan-500/20 text-slate-300"
                    : opt === currentQ.answer
                    ? "bg-green-600/15 border-green-500/40 text-green-400"
                    : selectedOpt === opt
                    ? "bg-red-600/15 border-red-500/40 text-red-400"
                    : "bg-slate-950 border-white/5 text-slate-600 opacity-60"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          {selectedOpt !== null && (
            <button
              onClick={handleNextTrivia}
              className="w-full py-2.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl hover:bg-cyan-500/20 transition-all flex items-center justify-center space-x-1"
            >
              <span>{currentIdx + 1 < TRIVIA_QUESTIONS.length ? "NEXT COGNITIVE NODE" : "COMPILE RESULTS"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// 4. BUG HUNTER COPS MODULE
function BugHunterGame({ addXP, unlockBadge }: { addXP: any; unlockBadge: any }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const [failed, setFailed] = useState(false);

  const q = BUG_HUNTER_QUESTIONS[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    if (idx === q.answerIndex) {
      setSolved(true);
      addXP(100, "Successfully audited logical software bug.");
      unlockBadge("badge-hunter", "Bug Auditor Elite", "Solved a logical bug in Code Cops.", "ShieldAlert", "border-red-500 text-red-400");
    } else {
      setFailed(true);
    }
  };

  const nextQuestion = () => {
    setSelectedIdx(null);
    setSolved(false);
    setFailed(false);
    setCurrentIdx((currentIdx + 1) % BUG_HUNTER_QUESTIONS.length);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
        <span className="font-bold text-red-400 flex items-center space-x-1.5">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>CODE COP DEPT // AUDIT RUNNING</span>
        </span>
        <span className="text-slate-400">{q.language}</span>
      </div>

      <div className="bg-slate-950 p-4 border border-white/5 rounded-xl text-[10.5px] overflow-x-auto whitespace-pre max-h-60 leading-normal text-slate-300">
        {q.code}
      </div>

      <div className="space-y-2 mt-4">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(idx)}
            className={`w-full text-left p-3 rounded-xl border text-[11px] transition-all font-semibold cursor-pointer ${
              selectedIdx === null
                ? "bg-slate-950 border-white/5 hover:border-red-500/20 text-slate-300"
                : idx === q.answerIndex
                ? "bg-green-600/15 border-green-500/40 text-green-400 font-bold"
                : selectedIdx === idx
                ? "bg-red-600/15 border-red-500/40 text-red-400"
                : "bg-slate-950 border-white/5 text-slate-600 opacity-60"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {solved && (
        <div className="bg-green-950/20 border border-green-500/20 p-4 rounded-xl text-green-400 space-y-2">
          <span className="font-bold uppercase tracking-widest block">[✓] SYSTEM SECURED // INTRUSION PREVENTED</span>
          <p className="text-slate-400 text-[11px] leading-relaxed">{q.explanation}</p>
          <button
            onClick={nextQuestion}
            className="w-full py-2 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 font-bold rounded-xl"
          >
            CONTINUE NEXT DEPLOY FILE AUDIT
          </button>
        </div>
      )}

      {failed && (
        <div className="bg-red-950/20 border border-red-500/20 p-4 rounded-xl text-red-400 text-center space-y-2">
          <span className="font-bold uppercase tracking-widest block">[X] COMPILE FAILED // BUG REMAINING</span>
          <button
            onClick={() => setSelectedIdx(null)}
            className="text-white underline text-[10px]"
          >
            Retry analysis on file
          </button>
        </div>
      )}
    </div>
  );
}

// 5. CODE ASSEMBLY PUZZLE MODULE
function CodeAssemblyGame({ addXP, unlockBadge }: { addXP: any; unlockBadge: any }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [shuffledLines, setShuffledLines] = useState<{ id: number; text: string }[]>([]);
  const [success, setSuccess] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const q = CODE_PUZZLE_QUESTIONS[currentIdx];

  const initPuzzle = () => {
    const linesWithIds = q.lines.map((line, idx) => ({ id: idx, text: line }));
    // Shuffle lines
    const shuffled = [...linesWithIds].sort(() => Math.random() - 0.5);
    setShuffledLines(shuffled);
    setSuccess(false);
    setHintIndex(0);
    setShowHint(false);
  };

  useEffect(() => {
    initPuzzle();
  }, [currentIdx]);

  // Handle rearranging code lines (moving up or down in array)
  const moveLine = (index: number, direction: "up" | "down") => {
    if (success) return;
    const nextIdx = index + (direction === "up" ? -1 : 1);
    if (nextIdx < 0 || nextIdx >= shuffledLines.length) return;

    const copy = [...shuffledLines];
    const temp = copy[index];
    copy[index] = copy[nextIdx];
    copy[nextIdx] = temp;
    setShuffledLines(copy);
  };

  const verifyAssembly = () => {
    const isCorrect = shuffledLines.every((line, idx) => line.id === idx);
    if (isCorrect) {
      setSuccess(true);
      addXP(100, "Assembled Redis caching configuration puzzle.");
      unlockBadge("badge-compiler", "Elite Compiler Coder", "Assembled compiled router chains.", "GitBranch", "border-purple-500 text-purple-400");
    } else {
      alert("Assembly verification mismatch. Inspect bracket hierarchies or tags serializations and retry.");
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
        <span className="font-bold text-purple-400">ROUTER CODE ASSEMBLY</span>
        <button 
          onClick={() => setShowHint(true)}
          className="text-[10px] text-cyan-400 underline hover:text-cyan-300"
        >
          Request clue
        </button>
      </div>

      <p className="text-slate-400 text-[11px] leading-normal">{q.title}</p>

      {/* Code list cards */}
      <div className="space-y-2">
        {shuffledLines.map((line, idx) => (
          <div 
            key={line.id} 
            className="bg-slate-950 p-2.5 border border-white/5 rounded-xl flex items-center justify-between font-mono text-[10.5px] text-slate-300"
          >
            <span>{line.text}</span>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => moveLine(idx, "up")}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
                title="Move fragment up"
              >
                ▲
              </button>
              <button 
                onClick={() => moveLine(idx, "down")}
                className="p-1 rounded bg-white/5 text-slate-400 hover:text-white"
                title="Move fragment down"
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      {showHint && (
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-cyan-400 text-[10px] leading-normal animate-in zoom-in duration-200">
          <span className="font-bold">CLUE:</span> {q.hints[hintIndex]}
        </div>
      )}

      {success ? (
        <div className="text-center bg-green-950/20 border border-green-500/20 p-4 rounded-xl text-green-400 space-y-2">
          <span className="font-bold uppercase tracking-widest block">[✓] COMPILATION COMPLETED // INTRUSION PASSED</span>
          <button
            onClick={() => setCurrentIdx((currentIdx + 1) % CODE_PUZZLE_QUESTIONS.length)}
            className="px-4 py-2 bg-green-500/10 border border-green-500/25 text-green-400 rounded-xl hover:bg-green-500/20"
          >
            CONTINUE NEXT COMPONENT ASSEMBLY
          </button>
        </div>
      ) : (
        <button
          onClick={verifyAssembly}
          className="w-full py-2.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold rounded-xl hover:bg-purple-500/20 transition-all flex items-center justify-center space-x-1 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>VERIFY PIPELINE COMPILATION</span>
        </button>
      )}
    </div>
  );
}

// 6. ESCAPE THE HACKER MODULE
function EscapeHackerGame({ addXP, unlockBadge }: { addXP: any; unlockBadge: any }) {
  const [decryptedText, setDecryptedText] = useState("");
  const [solved, setSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(false);

  const riddle = {
    cipherText: "50-48-53-45-44-41-48-43-41-43", // "PASSEDCHAC" reversed
    solution: "andrianus",
    clue: "Convert these hex values or ASCII characters: IDSTAR Lead full-stack developer's first name, entirely in lowercase."
  };

  const handleVerifyDecryption = (e: React.FormEvent) => {
    e.preventDefault();
    if (decryptedText.toLowerCase().trim() === riddle.solution) {
      setSolved(true);
      addXP(200, "Successfully escaped hacker infiltration.");
      unlockBadge("badge-cyber", "Cybersecurity Overlord", "Decrypted key firewall passwords.", "KeyRound", "border-yellow-500 text-yellow-400");
    } else {
      alert("INCORRECT DECRYPTION SYMBOL // FIREWALL ATTACK CONTINUES");
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 font-mono text-xs">
      <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
        <span className="font-bold text-yellow-500 flex items-center space-x-1.5">
          <Key className="w-4 h-4 animate-bounce" />
          <span>CYBER FIREWALL BYPASS</span>
        </span>
        <span className="text-slate-500">Node: SEC_DECRYPT_03</span>
      </div>

      <div className="p-4 bg-red-950/10 border border-red-500/20 rounded-xl space-y-2 text-red-400">
        <span className="font-bold">INTRUSION WARNING DETECTED:</span>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          An offshore hacker entity is attempting to force shut down the host pipeline. Decrypt the backdoor encryption master key to restart firewall nodes.
        </p>
      </div>

      <div className="bg-slate-950 p-4 border border-white/5 rounded-xl text-center">
        <span className="text-[10px] text-slate-500 block mb-1 uppercase">BACKDOOR ENCRYPTED PAYLOAD</span>
        <span className="text-lg font-bold text-white tracking-widest">{riddle.cipherText}</span>
      </div>

      {hintsUsed && (
        <div className="p-3 bg-yellow-950/20 border border-yellow-500/20 rounded-xl text-yellow-400 text-[10px] leading-relaxed">
          <span className="font-bold">CLUE INTEGRATED:</span> {riddle.clue}
        </div>
      )}

      {solved ? (
        <div className="text-center bg-green-950/20 border border-green-500/20 p-4 rounded-xl text-green-400 space-y-2">
          <span className="font-bold uppercase tracking-widest block">[✓] CYBER ATTACK THWARTED // SECURE STATUS</span>
          <p className="text-slate-400 text-[11px]">All system blocks restored. Backdoor closed with SSH keys serialization.</p>
        </div>
      ) : (
        <form onSubmit={handleVerifyDecryption} className="space-y-4">
          <input
            type="text"
            required
            placeholder="Input decrypted firewall key string..."
            value={decryptedText}
            onChange={(e) => setDecryptedText(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-yellow-500/40"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setHintsUsed(true); addXP(5, "Clue requested."); }}
              className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 rounded-xl text-xs font-bold"
            >
              REQUEST CLUE
            </button>
            <button
              type="submit"
              className="flex-grow py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-bold rounded-xl hover:bg-yellow-500/20"
            >
              TRANSMIT KEY DECRYPTION
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
