import { useState, useEffect } from "react";
import { 
  Briefcase, GraduationCap, ChevronRight, Code, Terminal, Sparkles, Award, Cpu, Globe
} from "lucide-react";
import { TimelineItem, UserProfile } from "../types/portfolio";
import { TIMELINE_DATA } from "../data/portfolioData";
import { useRenderTracker } from "../hooks/useRenderTracker";

interface AboutProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
}

export default function About({
  userProfile,
  addXP,
  language
}: AboutProps) {
  useRenderTracker("about");
  const [selectedTimelineTab, setSelectedTimelineTab] = useState<"all" | "experience" | "education">("all");
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const skills = [
    { name: "Laravel", level: 95, category: "Backend" },
    { name: "PHP 8.4", level: 95, category: "Backend" },
    { name: "Node.js", level: 90, category: "Backend" },
    { name: "TypeScript", level: 90, category: "Backend" },
    { name: "React 19", level: 88, category: "Frontend" },
    { name: "Next.js 15", level: 88, category: "Frontend" },
    { name: "Vue.js", level: 85, category: "Frontend" },
    { name: "Python", level: 80, category: "Backend" },
    { name: "Docker", level: 90, category: "DevOps" },
    { name: "Kubernetes", level: 85, category: "DevOps" },
    { name: "Redis", level: 92, category: "Backend" },
    { name: "PostgreSQL", level: 90, category: "Backend" },
    { name: "Kafka", level: 88, category: "DevOps" },
    { name: "AWS", level: 85, category: "DevOps" },
    { name: "Microservices", level: 90, category: "Backend" },
    { name: "CI/CD", level: 92, category: "DevOps" }
  ];

  const filteredTimeline = TIMELINE_DATA.filter(item => {
    if (selectedTimelineTab === "all") return true;
    return item.type === selectedTimelineTab;
  });

  return (
    <div className="py-8 space-y-16 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title block */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Credentials & Timeline" : "Kredensial & Riwayat Kerja"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "A record of engineering milestones & core capabilities" : "Catatan pencapaian rekayasa & keahlian inti"}
        </p>
      </div>

      {/* Grid: 3D Avatar Simulator & Skills Bar Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cyber Interactive Avatar & Core Metrics */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden text-center">
            
            {/* Visual background overlay radar */}
            <div className="absolute top-2 right-2 w-10 h-10 border border-cyan-500/10 rounded-full animate-ping pointer-events-none" />

            {/* Simulated 3D Developer Avatar Node */}
            <div className="w-28 h-28 rounded-2xl mx-auto bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-1 shadow-xl shadow-cyan-500/15 relative group overflow-hidden">
              <div className="w-full h-full rounded-xl bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {/* Visual grid avatar */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:10px_10px] opacity-45" />
                <Terminal className="w-12 h-12 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <h3 className="font-display font-bold text-white text-lg">Andrianus Maria</h3>
              <p className="font-mono text-xs text-cyan-400">LEAD FULL-STACK ENGINEER</p>
              <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-500 mt-2">
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span>JAKARTA, INDONESIA</span>
              </div>
            </div>

            {/* Mini Core Stat counters */}
            <div className="grid grid-cols-3 gap-2 mt-6 border-t border-white/5 pt-5 text-center font-mono">
              <div>
                <span className="block text-white font-bold text-sm">7+</span>
                <span className="text-[9px] text-slate-500 uppercase">Years Exp</span>
              </div>
              <div>
                <span className="block text-white font-bold text-sm">30+</span>
                <span className="text-[9px] text-slate-500 uppercase">Systems</span>
              </div>
              <div>
                <span className="block text-white font-bold text-sm">5M+</span>
                <span className="text-[9px] text-slate-500 uppercase">Users</span>
              </div>
            </div>
          </div>

          {/* Quick Technical Briefing box */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 font-mono text-xs space-y-3">
            <span className="font-bold text-cyan-400 block tracking-widest uppercase text-[10px]">// TECHNICAL AUDIT</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              &gt; Host: IDSTAR Lead Cluster Node<br />
              &gt; Standard: WCAG AA Compliant<br />
              &gt; Database latency: &lt;15ms verified with Redis cache tag invalidation matrices.<br />
              &gt; Kubernetes orchestrations: EKS multi-zone clusters handling high peaks with zero packet degradation.
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Tech Skill progress Bars */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="font-display font-bold text-white text-base">
              {language === "EN" ? "Capabilities & Skill Matrix" : "Matriks Keahlian Rekayasa"}
            </h3>
            <span className="font-mono text-[10px] text-slate-500">TAGGED LEVEL %</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skills.map((sk) => (
              <div 
                key={sk.name}
                onMouseEnter={() => {
                  setHoveredSkill(sk.name);
                  addXP(2, `Hovered on skill ${sk.name}`);
                }}
                onMouseLeave={() => setHoveredSkill(null)}
                className="bg-white/5 border border-white/5 rounded-xl p-3 hover:border-cyan-500/20 transition-all cursor-pointer relative"
              >
                <div className="flex justify-between items-center mb-2 font-mono text-xs text-slate-300">
                  <span className="font-bold flex items-center space-x-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${sk.category === "Backend" ? "bg-blue-400" : sk.category === "Frontend" ? "bg-cyan-400" : "bg-purple-400"}`} />
                    <span>{sk.name}</span>
                  </span>
                  <span className="font-semibold text-cyan-400">{sk.level}%</span>
                </div>

                {/* Progress track */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-1000"
                    style={{ width: hoveredSkill === sk.name ? `${sk.level}%` : `${Math.min(sk.level, 70)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[10px] font-mono text-slate-500">
            Hover over any technical node to run precise memory diagnostics.
          </div>
        </div>
      </div>

      {/* Experience Timeline Vertical block */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-white text-xl">
              {language === "EN" ? "Professional Path" : "Langkah Profesional"}
            </h3>
            <p className="text-xs text-slate-500 font-mono">CHRONOLOGICAL ENGINE STATUS</p>
          </div>

          {/* Tab Filter selectors */}
          <div className="flex bg-slate-950 border border-white/5 p-1 rounded-lg mt-3 sm:mt-0 font-mono text-[10px]">
            {(["all", "experience", "education"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setSelectedTimelineTab(tab);
                  addXP(10, `Filtered timeline by ${tab}`);
                }}
                className={`px-3 py-1.5 rounded uppercase font-bold transition-all ${
                  selectedTimelineTab === tab 
                    ? "bg-cyan-500/15 text-cyan-400" 
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical Timeline Tree */}
        <div className="relative border-l border-white/10 ml-4 md:ml-6 pl-6 sm:pl-8 space-y-12 py-4">
          {filteredTimeline.map((item, idx) => (
            <div key={item.id} className="relative group">
              
              {/* Timeline dot icon with category styles */}
              <span className={`absolute -left-12 sm:-left-14 top-1.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-mono shadow-md ${item.logo}`}>
                {item.type === "experience" ? <Briefcase className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
              </span>

              {/* Box info panel */}
              <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/5 hover:border-cyan-500/20 shadow-xl transition-all relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-3 mb-4">
                  <div>
                    <h4 className="font-display font-bold text-white text-base sm:text-lg group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-cyan-400 text-xs font-mono font-semibold block sm:inline">
                      {item.organization}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-slate-950 border border-white/5 text-[10px] font-mono text-slate-400 self-start sm:self-center">
                    {item.period}
                  </span>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Highlights lists */}
                {item.highlights && item.highlights.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block tracking-wider">Achievements Key:</span>
                    <ul className="space-y-1.5">
                      {item.highlights.map((high, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-slate-300 leading-normal">
                          <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{high}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
