import { useState, useEffect } from "react";
import { 
  Database, LineChart, ShieldCheck, Mail, Users, HardDrive, RefreshCw, Cpu, Activity, Gauge, Zap
} from "lucide-react";
import { UserProfile } from "../types/portfolio";

interface TelemetryLog {
  sectionName: string;
  duration: number;
  timestamp: string;
  status: "OPTIMAL" | "MODERATE" | "WARN";
}

interface AdminPanelProps {
  userProfile: UserProfile;
  language: "EN" | "ID";
  messages: any[];
}

export default function AdminPanel({
  userProfile,
  language,
  messages
}: AdminPanelProps) {
  const [dbStatus, setDbStatus] = useState("SECURED_STABLE");
  const [seoConfig, setSeoConfig] = useState({
    title: "Andrianus Portfolio - Lead Full Stack Engineer",
    desc: "Interactive developer portfolio showcasing microservices, Laravel caches, GCP deployments & AI assistants."
  });

  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryLog[]>(() => {
    // Populate some initial realistic telemetry readings to start with
    return [
      { sectionName: "hero", duration: 4.12, timestamp: new Date().toLocaleTimeString(), status: "OPTIMAL" },
      { sectionName: "about", duration: 2.84, timestamp: new Date().toLocaleTimeString(), status: "OPTIMAL" },
    ];
  });

  // Listen to live section render telemetry events dispatched from our custom hook
  useEffect(() => {
    const handleTelemetry = (e: Event) => {
      const customEvent = e as CustomEvent<TelemetryLog>;
      if (customEvent.detail) {
        setTelemetryLogs((prev) => {
          // Prevent duplicates by updating the section if it already exists, or append
          const existsIdx = prev.findIndex(item => item.sectionName === customEvent.detail.sectionName);
          if (existsIdx > -1) {
            const updated = [...prev];
            updated[existsIdx] = customEvent.detail;
            return updated;
          }
          return [customEvent.detail, ...prev];
        });
      }
    };

    window.addEventListener("portfolio-telemetry-report", handleTelemetry);
    return () => {
      window.removeEventListener("portfolio-telemetry-report", handleTelemetry);
    };
  }, []);

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Admin Command Console" : "Konsol Pusat Kontrol"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "Monitor database logs, server diagnostic channels & contact payloads" : "Pantau log database, saluran diagnostik server & pesan masuk"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Server Status parameters */}
        <div className="lg:col-span-4 space-y-6 font-mono text-xs">
          
          {/* Server stats */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-white text-sm flex items-center space-x-1.5 border-b border-white/5 pb-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>SERVER HARDWARE DIAGNOSTICS</span>
            </h3>

            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-500">Node Core CPU:</span>
                <span className="text-green-400 font-bold">4.2% Load // STABLE</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-500">Cache Memory:</span>
                <span className="text-cyan-400 font-bold">128MB / 512MB</span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl">
                <span className="text-slate-500">Response Latency:</span>
                <span className="text-green-400 font-bold">12ms</span>
              </div>
            </div>
          </div>

          {/* DB Control */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-3">
            <h3 className="font-display font-bold text-white text-sm flex items-center space-x-1.5">
              <Database className="w-5 h-5 text-purple-400" />
              <span>DATABASE CONTROLS</span>
            </h3>

            <p className="text-slate-400 text-[10px] leading-relaxed">
              Maintain schema states, seed tables, and run vacuum commands on Redis/Postgres pools.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => alert("Redis cache tags invalidated cleanly.")}
                className="flex-1 py-2 bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-purple-400 rounded-lg text-[10px] font-bold"
              >
                FLUSH REDIS
              </button>
              <button
                onClick={() => alert("PostgreSQL table vacuumed correctly.")}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-[10px] font-bold border border-white/5"
              >
                VACUUM DB
              </button>
            </div>
          </div>

          {/* Rendering Time Telemetry & Optimization Debugger */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-white text-sm flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center space-x-1.5">
                <Gauge className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>RENDER TELEMETRY DEBUGGER</span>
              </div>
              <span className="text-[9px] bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest uppercase">
                ACTIVE
              </span>
            </h3>

            <p className="text-slate-400 text-[10px] leading-relaxed">
              Real-time measurement of rendering cycles triggered by our custom React hook <code className="text-cyan-400 font-mono">useRenderTracker</code>.
            </p>

            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {telemetryLogs.map((log) => {
                const colorMap = {
                  OPTIMAL: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "OPTIMAL" },
                  MODERATE: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "MODERATE" },
                  WARN: { text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", label: "WARN" },
                }[log.status] || { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", label: "ACTIVE" };

                return (
                  <div key={log.sectionName} className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5 flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-[11px] uppercase tracking-wide">
                        {log.sectionName}
                      </span>
                      <span className={`text-[8px] px-1 rounded border ${colorMap.bg} ${colorMap.text} ${colorMap.border} font-bold`}>
                        {colorMap.label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-500">Render Time:</span>
                      <span className={`font-mono font-bold ${colorMap.text}`}>
                        {log.duration.toFixed(3)} ms
                      </span>
                    </div>
                    <div className="text-[8px] text-slate-600 text-right">
                      Reported at {log.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/5 pt-3 space-y-2">
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Diagnostics: 100% stable framerate.</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] text-purple-400">
                <Zap className="w-3.5 h-3.5" />
                <span>Observer: scroll mt-24 optimized.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Logs tracker & SEO Manager */}
        <div className="lg:col-span-8 space-y-8 font-mono text-xs">
          
          {/* Incoming contact messages log */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center space-x-1.5 border-b border-white/5 pb-3">
              <Mail className="w-5 h-5 text-cyan-400" />
              <span>Incoming Message Packets ({messages.length})</span>
            </h3>

            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No messaging packets compiled inside local logs database.
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="bg-slate-950 p-4 border border-white/5 rounded-xl space-y-1 relative">
                    <div className="flex justify-between text-slate-500 text-[10px]">
                      <span className="font-bold text-cyan-400">&gt; Sender: {m.sender} ({m.email})</span>
                      <span>{m.date}</span>
                    </div>
                    <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">{m.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO config values */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center space-x-1.5 border-b border-white/5 pb-3">
              <LineChart className="w-5 h-5 text-purple-400" />
              <span>Search Engine Optimization (SEO) Metadata</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase block">Global Meta Title</label>
                <input
                  type="text"
                  value={seoConfig.title}
                  onChange={(e) => setSeoConfig({ ...seoConfig, title: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase block">Global Meta Description</label>
                <textarea
                  rows={2}
                  value={seoConfig.desc}
                  onChange={(e) => setSeoConfig({ ...seoConfig, desc: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-purple-500/40 resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={() => alert("SEO configuration values synchronized globally.")}
                className="py-2.5 px-4 bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 text-purple-400 font-bold rounded-xl"
              >
                APPLY SEO SYNCHRONIZATION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
