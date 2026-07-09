import React, { useState } from "react";
import { 
  Award, Bookmark, Calendar, CheckSquare, ShieldCheck, Heart, ArrowUpRight, Trophy, Sparkles, RefreshCw
} from "lucide-react";
import { UserProfile, Badge } from "../types/portfolio";
import { BLOGS_DATA } from "../data/portfolioData";
import { useRenderTracker } from "../hooks/useRenderTracker";

interface DashboardProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
  bookmarks: string[];
  setActiveSection: (sec: string) => void;
  updateProfileName: (name: string) => void;
  highlightBadge?: boolean;
}

export default function Dashboard({
  userProfile,
  addXP,
  language,
  bookmarks,
  setActiveSection,
  updateProfileName,
  highlightBadge = false
}: DashboardProps) {
  useRenderTracker("dashboard");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);

  const [lastSynced, setLastSynced] = useState<string>(() => {
    const cachedTime = localStorage.getItem("andrianus_last_sync_time");
    if (cachedTime) return cachedTime;
    const now = new Date().toLocaleTimeString();
    localStorage.setItem("andrianus_last_sync_time", now);
    return now;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const triggerManualSync = () => {
    setIsSyncing(true);
    setSyncMessage(null);
    setTimeout(() => {
      localStorage.setItem("andrianus_user_profile", JSON.stringify(userProfile));
      localStorage.setItem("andrianus_bookmarks", JSON.stringify(bookmarks));
      
      const now = new Date().toLocaleTimeString();
      localStorage.setItem("andrianus_last_sync_time", now);
      setLastSynced(now);
      setIsSyncing(false);
      setSyncMessage(language === "EN" ? "Profile and gamification data synchronized successfully!" : "Data profil dan gamifikasi berhasil disinkronkan!");
      
      addXP(5, "Manually synchronized local profile data.");
      
      setTimeout(() => {
        setSyncMessage(null);
      }, 4000);
    }, 1200);
  };

  const saveProfileName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfileName(nameInput);
    setEditingName(false);
    addXP(15, "Updated profile handle.");
  };

  const bookmarkedBlogs = BLOGS_DATA.filter((b) => bookmarks.includes(b.id));

  // Pre-configured mock certificates Andrianus owns, representing his CKA, AWS Architect details!
  const certs = [
    { title: "AWS Solutions Architect - Associate", issuer: "Amazon Web Services", date: "2025", verifyId: "AWS-ASA-992" },
    { title: "Certified Kubernetes Administrator (CKA)", issuer: "The Linux Foundation", date: "2024", verifyId: "CKA-294-882" },
    { title: "Oracle Java SE Programmer", issuer: "Oracle Academy", date: "2023", verifyId: "ORA-JP-392" }
  ];

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Visitor Console" : "Konsol Profil Pengunjung"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "Your developer rank, badges & saved assets log" : "Peringkat pengembang, lencana & aset disimpan Anda"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Editable handle avatar name & Levels */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/5 text-center space-y-4">
            
            {/* Main level badge */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 mx-auto flex items-center justify-center font-display font-extrabold text-white text-3xl shadow-xl shadow-cyan-500/15 relative">
              <span>{userProfile.level}</span>
              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-pulse" />
            </div>

            <div className="space-y-1">
              {editingName ? (
                <form onSubmit={saveProfileName} className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none w-full"
                  />
                  <button type="submit" className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 rounded-xl text-xs font-mono">
                    SAVE
                  </button>
                </form>
              ) : (
                <div className="flex items-center justify-center space-x-1">
                  <h3 className="font-display font-bold text-white text-lg">{userProfile.name}</h3>
                  <button 
                    onClick={() => setEditingName(true)}
                    className="text-[10px] text-cyan-400 underline hover:text-cyan-300 ml-1.5"
                  >
                    Edit
                  </button>
                </div>
              )}
              <span className="font-mono text-xs text-cyan-400 uppercase tracking-widest block font-semibold">{userProfile.rank}</span>
            </div>

            {/* General progress info */}
            <div className="border-t border-white/5 pt-5 text-left font-mono text-[11px] space-y-2 text-slate-400">
              <div className="flex justify-between">
                <span>Total XP gathered:</span>
                <span className="text-white font-bold">{userProfile.xp} XP</span>
              </div>
              <div className="flex justify-between">
                <span>Badges Unlocked:</span>
                <span className="text-white font-bold">{userProfile.badges.length} Unlocked</span>
              </div>
              <div className="flex justify-between">
                <span>System Security Level:</span>
                <span className="text-green-400 font-bold">STABLE_SECURED</span>
              </div>
            </div>

            {/* Sync Status Sector */}
            <div className="border-t border-white/5 pt-4 text-left font-mono text-[11px] space-y-3">
              <div className="flex justify-between items-center text-slate-400">
                <span>Local Storage Sync:</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                  ONLINE
                </span>
              </div>
              
              <div className="flex justify-between items-center text-slate-400">
                <span>Last Updated:</span>
                <span className="text-slate-300 font-semibold">{lastSynced}</span>
              </div>

              <button
                onClick={triggerManualSync}
                disabled={isSyncing}
                className="w-full mt-1.5 py-2 px-3 bg-white/5 hover:bg-white/10 active:bg-white/15 disabled:bg-white/5 disabled:opacity-50 border border-white/10 hover:border-cyan-400/30 rounded-xl text-center font-bold text-[11px] text-white flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 group-hover:text-cyan-300 transition-colors ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? (language === "EN" ? "SYNCING..." : "MENYINKRONKAN...") : (language === "EN" ? "SYNC PROFILE DATA" : "SINKRON DATA PROFIL")}</span>
              </button>

              {syncMessage && (
                <div className="mt-2 text-[10px] text-emerald-400 text-center animate-fade-in py-1 px-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  {syncMessage}
                </div>
              )}
            </div>
          </div>

          {/* Verification credentials listings Andrianus holds */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4 font-mono text-xs">
            <h3 className="font-display font-bold text-white text-sm flex items-center space-x-1.5">
              <ShieldCheck className="w-5 h-5 text-green-400" />
              <span>Andrianus Certificates</span>
            </h3>

            <div className="space-y-3 text-[11px]">
              {certs.map((c) => (
                <div key={c.verifyId} className="bg-slate-950 p-3 border border-white/5 rounded-xl space-y-1 relative group">
                  <span className="text-white font-bold block">{c.title}</span>
                  <div className="flex justify-between text-slate-500 text-[10px]">
                    <span>{c.issuer} // {c.date}</span>
                    <span className="text-cyan-400/80 uppercase">VERIFIED</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Badges Collection grid & bookmarks */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Unlocked Badges section */}
          <div className={`glass-panel rounded-2xl p-6 border space-y-4 transition-all duration-500 ${
            highlightBadge 
              ? "badge-section-highlight border-transparent" 
              : "border-white/5"
          }`}>
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center space-x-2">
                <Award className={`w-5 h-5 ${highlightBadge ? "text-amber-400 animate-bounce" : "text-cyan-400"}`} />
                <h3 className="font-display font-bold text-white text-base">My Badges Collection</h3>
              </div>
              {highlightBadge && (
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  NEW REWARD UNLOCKED
                </span>
              )}
            </div>

            {userProfile.badges.length === 0 ? (
              <div className="text-center py-10 font-mono text-xs text-slate-500">
                No badges unlocked. Explore sections or solve missions in the Fun Zone to earn badges!
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
                {userProfile.badges.map((b) => (
                  <div 
                    key={b.id}
                    className={`bg-slate-950 p-4 border rounded-2xl text-center space-y-2 hover:scale-[1.01] transition-all cursor-pointer ${b.color}`}
                  >
                    <Trophy className="w-8 h-8 mx-auto text-cyan-400 animate-pulse" />
                    <div>
                      <span className="font-bold text-white block text-[11px] truncate">{b.title}</span>
                      <span className="text-[9px] text-slate-500 block leading-tight mt-1 truncate" title={b.description}>{b.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarked items section */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
              <Bookmark className="w-5 h-5 text-purple-400" />
              <h3 className="font-display font-bold text-white text-base">Bookmarked Logs</h3>
            </div>

            {bookmarkedBlogs.length === 0 ? (
              <div className="text-center py-10 font-mono text-xs text-slate-500">
                No bookmarks log. Click the bookmark ribbon inside individual Insights articles to save them here.
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                {bookmarkedBlogs.map((b) => (
                  <div 
                    key={b.id}
                    onClick={() => setActiveSection("blog")}
                    className="p-3.5 bg-slate-950 border border-white/5 rounded-xl flex items-center justify-between hover:border-cyan-500/20 cursor-pointer transition-all"
                  >
                    <div>
                      <span className="text-white font-bold block">{b.title}</span>
                      <span className="text-slate-500 text-[10px] mt-1 block">{b.date} // {b.readingTime}</span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
