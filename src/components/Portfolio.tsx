import { useState } from "react";
import { createPortal } from "react-dom";
import { 
  ExternalLink, Github, BarChart3, ChevronRight, X, LayoutGrid, CheckCircle2, ShieldAlert
} from "lucide-react";
import { Project, UserProfile } from "../types/portfolio";
import { PROJECTS_DATA } from "../data/portfolioData";
import { useRenderTracker } from "../hooks/useRenderTracker";

interface PortfolioProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
  searchQuery: string;
}

export default function Portfolio({
  userProfile,
  addXP,
  language,
  searchQuery
}: PortfolioProps) {
  useRenderTracker("portfolio");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);

  // Filter Categories list
  const categories = ["all", "Web", "Mobile", "Desktop", "AI", "Backend", "DevOps", "Game"];

  // Filter project arrays based on search query and category tab selections
  const filteredProjects = PROJECTS_DATA.filter((p) => {
    const matchesCategory = selectedFilter === "all" || p.category.toLowerCase() === selectedFilter.toLowerCase();
    const matchesSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const openProjectModal = (proj: Project) => {
    setActiveProjectModal(proj);
    addXP(30, `Viewed case study details for ${proj.title}`);
  };

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Systems Repository" : "Galeri Sistem Rekayasa"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "A showcase of high-performance architectural builds" : "Koleksi sistem rekayasa performa tinggi"}
        </p>
      </div>

      {/* Category Selection Filter pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto font-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedFilter(cat);
              addXP(10, `Filtered projects by category: ${cat}`);
            }}
            className={`px-4 py-2 rounded-xl border transition-all uppercase font-semibold ${
              selectedFilter === cat 
                ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40 shadow-lg shadow-cyan-500/5" 
                : "bg-white/5 text-slate-400 border-white/5 hover:text-white hover:border-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-white/5">
          <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-xs">No systems found matching selected parameters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredProjects.map((p) => (
            <div 
              key={p.id}
              className="glass-panel rounded-2xl border border-white/5 hover:border-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all flex flex-col justify-between overflow-hidden group"
            >
              
              {/* Cover Image element */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
                
                {/* Visual Category badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-slate-950/80 backdrop-blur border border-white/10 text-[9px] font-mono font-bold text-cyan-400 uppercase rounded-full">
                  {p.category}
                </span>

                {/* Performance Dial Badge overlay */}
                <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 bg-slate-950/80 backdrop-blur border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-mono text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>LIGHTHOUSE {p.metrics.lighthouse}</span>
                </div>
              </div>

              {/* Text Blocks */}
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-white text-xl group-hover:text-cyan-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {p.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions Footer bar */}
              <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => openProjectModal(p)}
                  className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                >
                  <span>CASE STUDY // AUDIT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center space-x-3">
                  {p.github && (
                    <a 
                      href={p.github} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-500 hover:text-white transition-colors p-1"
                      title="View Source on Github"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {p.demo && (
                    <a 
                      href={p.demo} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
                      title="View Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Study Modals overlay */}
      {activeProjectModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 border border-white/15 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh]">
            
            {/* Modal close */}
            <button
              onClick={() => setActiveProjectModal(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-white/5 pb-4">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                ENTERPRISE SYSTEM ARCHITECTURE AUDIT
              </span>
              <h3 className="font-display font-extrabold text-white text-2xl">
                {activeProjectModal.title}
              </h3>
            </div>

            {/* Performance Dial Charts inside Case study */}
            <div className="grid grid-cols-4 gap-3 bg-slate-950/60 p-4 border border-white/5 rounded-xl text-center font-mono">
              <div>
                <span className="block text-green-400 font-bold text-sm">{activeProjectModal.metrics.performance}</span>
                <span className="text-[9px] text-slate-500 uppercase">Performance</span>
              </div>
              <div>
                <span className="block text-green-400 font-bold text-sm">{activeProjectModal.metrics.seo}</span>
                <span className="text-[9px] text-slate-500 uppercase">SEO Score</span>
              </div>
              <div>
                <span className="block text-green-400 font-bold text-sm">{activeProjectModal.metrics.accessibility}</span>
                <span className="text-[9px] text-slate-500 uppercase">Access</span>
              </div>
              <div>
                <span className="block text-cyan-400 font-bold text-sm">99%</span>
                <span className="text-[9px] text-slate-500 uppercase">Uptime SLA</span>
              </div>
            </div>

            {/* Core details sections */}
            {activeProjectModal.caseStudy && (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-red-400 uppercase block tracking-widest">
                    [01] THE CHALLENGE DETECTED:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {activeProjectModal.caseStudy.challenge}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block tracking-widest">
                    [02] THE SOLUTION RESOLVED:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {activeProjectModal.caseStudy.solution}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-green-400 uppercase block tracking-widest">
                    [03] METRIC OUTCOME IMPACT:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {activeProjectModal.caseStudy.impact}
                  </p>
                </div>
              </div>
            )}

            {/* Modal action links */}
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <button
                onClick={() => setActiveProjectModal(null)}
                className="px-4 py-2 bg-white/5 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                CLOSE ENGINE REPORT
              </button>
              {activeProjectModal.demo && (
                <a
                  href={activeProjectModal.demo}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 hover:shadow-cyan-500/10 hover:scale-105 transition-all"
                >
                  <span>CONNECT HOST PIPELINE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
