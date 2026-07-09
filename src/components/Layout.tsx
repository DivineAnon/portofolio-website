import React, { useState, useEffect } from "react";
import { 
  Terminal, ShieldAlert, Cpu, Award, Search, Menu, X, Bell, Globe, ChevronDown, User, Code2, CpuIcon, Layers, FileText, Palette
} from "lucide-react";
import { UserProfile, Badge } from "../types/portfolio";

interface LayoutProps {
  userProfile: UserProfile;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  onSearch: (query: string) => void;
  language: "EN" | "ID";
  setLanguage: (lang: "EN" | "ID") => void;
  theme: "cyberpunk" | "navy" | "green";
  setTheme: (theme: "cyberpunk" | "navy" | "green") => void;
  children: React.ReactNode;
}

export default function Layout({
  userProfile,
  activeSection,
  setActiveSection,
  onSearch,
  language,
  setLanguage,
  theme,
  setTheme,
  children
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([
    "Terminal session initialized // Host standard port :3000",
    "Welcome Developer! Complete missions to earn badges and XP."
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic system status pulses
  const [sysTime, setSysTime] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setSysTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update notification logs when badges unlock or level ups occur
  useEffect(() => {
    if (userProfile.level > 1) {
      setNotifications(prev => [
        `LEVEL UP! You reached Level ${userProfile.level} (${userProfile.rank})`,
        ...prev
      ]);
    }
  }, [userProfile.level]);

  useEffect(() => {
    if (userProfile.badges.length > 0) {
      const latestBadge = userProfile.badges[userProfile.badges.length - 1];
      setNotifications(prev => [
        `UNLOCKED BADGE: ${latestBadge.title} - ${latestBadge.description}`,
        ...prev
      ]);
    }
  }, [userProfile.badges.length]);

  const navItems = [
    { id: "hero", label: language === "EN" ? "Home" : "Beranda" },
    { id: "about", label: language === "EN" ? "Experience" : "Pengalaman" },
    { id: "portfolio", label: language === "EN" ? "Projects" : "Proyek" },
    { id: "blog", label: language === "EN" ? "Insights" : "Artikel" },
    { id: "fun-zone", label: language === "EN" ? "Developer Quest" : "Misi Pengembang" },
    { id: "dashboard", label: language === "EN" ? "My Profile" : "Profil Saya" },
    { id: "admin", label: language === "EN" ? "Console" : "Konsol" }
  ];

  return (
    <div className={`relative min-h-screen flex flex-col selection:bg-theme-accent/30 selection:text-theme-accent theme-${theme} transition-all duration-500`}>
      {/* Background container to isolate glowing blobs from stretching the page height */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Dynamic Ambient Glowing Blobs - Frosted Glass Theme Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-theme-blob1 rounded-full blur-[120px] transition-all duration-500" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-theme-blob2 rounded-full blur-[120px] transition-all duration-500" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-theme-blob3 rounded-full blur-[120px] transition-all duration-500" />
      </div>

      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 shadow-2xl backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & System Status Indicator */}
          <div 
            onClick={() => setActiveSection("hero")} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-theme-accent text-white shadow-lg shadow-theme-accent/10 relative overflow-hidden">
              <Terminal className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-display font-bold tracking-widest text-lg text-white group-hover:text-theme-accent transition-colors">
                ANDRIANUS
              </span>
              <div className="flex items-center space-x-1.5 text-[9px] font-mono tracking-wider text-theme-accent">
                <span className="inline-block w-1.5 h-1.5 bg-theme-accent rounded-full animate-ping" />
                <span>SECURE // UTC {sysTime}</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 4).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMegaMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide font-sora transition-all duration-300 relative ${
                  activeSection === item.id 
                    ? "text-theme-accent bg-white/5" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-theme-accent rounded-full" />
                )}
              </button>
            ))}

            {/* Mega Menu Toggle */}
            <div className="relative">
              <button
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 flex items-center space-x-1 transition-all"
              >
                <span>{language === "EN" ? "Explore Services" : "Layanan"}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Mega Menu Dropdown */}
              {megaMenuOpen && (
                <div className="absolute top-12 left-0 w-80 glass-panel border border-white/10 rounded-xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-3">Enterprise Stack</h4>
                  <div className="space-y-4">
                    <div 
                      onClick={() => { setActiveSection("portfolio"); setMegaMenuOpen(false); }}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <CpuIcon className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Microservices Integration</span>
                        <span className="text-[10px] text-slate-400">High-throughput Kafka queues & container architecture.</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => { setActiveSection("about"); setMegaMenuOpen(false); }}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <Layers className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Full-Stack Scale</span>
                        <span className="text-[10px] text-slate-400">Robust PHP Laravel backends linked with dynamic React modules.</span>
                      </div>
                    </div>
                    <div 
                      onClick={() => { setActiveSection("fun-zone"); setMegaMenuOpen(false); }}
                      className="flex items-start space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <Code2 className="w-5 h-5 text-purple-400 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-white block">Interactive Gamification</span>
                        <span className="text-[10px] text-slate-400">Build interactive applications & systems with fun layers.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navItems.slice(4).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMegaMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide font-sora transition-all duration-300 relative ${
                  activeSection === item.id 
                    ? "text-cyan-400 bg-white/5" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Action Widgets */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* Search Toggle (Hidden on mobile phones, visible on sm and up) */}
            <div className="hidden sm:block relative">
              {searchOpen ? (
                <div className="flex items-center bg-slate-900/80 border border-cyan-500/30 rounded-lg px-2 py-1.5 transition-all">
                  <input
                    type="text"
                    placeholder={language === "EN" ? "Smart search projects..." : "Cari proyek..."}
                    value={searchVal}
                    onChange={(e) => {
                      setSearchVal(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="bg-transparent text-xs text-white outline-none w-32 sm:w-44 px-1"
                    autoFocus
                  />
                  <button 
                    onClick={() => { setSearchOpen(false); setSearchVal(""); onSearch(""); }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Switcher (Hidden on mobile phones, visible on sm and up) */}
            <div className="hidden sm:block">
              <button
                onClick={() => setLanguage(language === "EN" ? "ID" : "EN")}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 flex items-center space-x-1 text-xs font-mono transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-theme-accent" />
                <span className="font-bold">{language}</span>
              </button>
            </div>

            {/* Desktop Theme Switcher (Hidden on mobile phones, visible on sm and up) */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 flex items-center space-x-1.5 text-xs font-mono transition-colors"
                title="Switch Aesthetic Theme"
              >
                <Palette className="w-3.5 h-3.5 text-theme-accent" />
                <span className="font-bold uppercase hidden md:inline">
                  {theme === "cyberpunk" ? "Neon" : theme === "navy" ? "Navy" : "Green"}
                </span>
              </button>

              {showThemeDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemeDropdown(false)} />
                  <div className="absolute right-0 top-12 w-48 glass-panel border border-white/10 rounded-xl p-2.5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-50">
                    <div className="text-[9px] font-mono font-bold text-theme-accent px-2 py-1 border-b border-white/5 mb-1.5 uppercase tracking-widest">
                      Aesthetic Scheme
                    </div>
                    <div className="space-y-1">
                      {[
                        { id: "cyberpunk", label: "Cyberpunk Neon", dot: "bg-cyan-400" },
                        { id: "navy", label: "Deep Space Navy", dot: "bg-blue-500" },
                        { id: "green", label: "Terminal Green", dot: "bg-emerald-400" }
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => {
                            setTheme(t.id as any);
                            setShowThemeDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-xs font-mono transition-all ${
                            theme === t.id 
                              ? "bg-white/10 text-white font-bold" 
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          <span className="truncate">{t.label}</span>
                          <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notifications Alert Bell (Hidden on mobile phones, visible on sm and up) */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 relative transition-colors"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-72 sm:w-80 glass-panel border border-white/10 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 z-50 max-h-96 overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">CONSOLE ALERT LOGS</span>
                    <button 
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-slate-500 hover:text-red-400 transition-colors"
                    >
                      Clear Logs
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs font-mono">
                      No new alerts on host pipeline.
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-[10.5px]">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="flex items-start space-x-2 border-b border-white/5 pb-2">
                          <span className="text-cyan-400 mt-0.5">&gt;</span>
                          <p className="text-slate-300 leading-normal">{notif}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Interactive User Level Profile Widget */}
            <div 
              onClick={() => setActiveSection("dashboard")}
              className="flex items-center space-x-2 bg-white/5 border border-white/5 rounded-full p-1 pl-3 pr-2 cursor-pointer hover:border-cyan-500/30 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] group shrink-0"
            >
              <div className="hidden sm:block lg:hidden xl:block text-right whitespace-nowrap">
                <span className="block text-[10px] font-bold text-white leading-none">
                  {userProfile.name}
                </span>
                <span className="text-[8px] font-mono text-cyan-400 uppercase leading-none tracking-widest mt-0.5 block">
                  {userProfile.rank}
                </span>
              </div>
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shrink-0">
                <span className="font-display font-bold text-xs">Lvl{userProfile.level}</span>
                {/* Visual XP indicator arc ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/20" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-over Overlay Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300 ease-out"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 w-[290px] sm:w-[320px] bg-slate-950/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}>
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-xs tracking-wider text-slate-300 uppercase">SYSTEM MENU</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-cyan-400" />
          </button>
        </div>

        {/* User Mini Profile inside Drawer (Premium Integrated Look) */}
        <div className="p-5 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-display font-bold shadow-md shadow-cyan-500/10">
              Lvl{userProfile.level}
              <div className="absolute inset-0 rounded-full border border-cyan-400/30" />
            </div>
            <div>
              <span className="block text-xs font-bold text-white leading-tight">{userProfile.name}</span>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest leading-none mt-1 block">{userProfile.rank}</span>
            </div>
          </div>
        </div>

        {/* Drawer Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto p-5 space-y-5">
          {/* Mobile Search Input */}
          <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-cyan-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder={language === "EN" ? "Search portfolio..." : "Cari proyek..."}
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                onSearch(e.target.value);
              }}
              className="bg-transparent text-xs text-white outline-none w-full font-mono placeholder:text-slate-600"
            />
            {searchVal && (
              <button onClick={() => { setSearchVal(""); onSearch(""); }} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Navigation Items list */}
          <div className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setMobileMenuOpen(false);
                }}
                 className={`w-full text-left px-4 py-3 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                  activeSection === item.id 
                    ? "text-theme-accent bg-white/5 font-bold border-l-2 border-theme-accent pl-3 shadow-[inset_4px_0_12px_rgba(6,182,212,0.05)]" 
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Configs (Language + notifications triggers) */}
          <div className="border-t border-white/5 pt-5 flex items-center justify-between gap-3">
            {/* Mobile Language Switcher Toggle */}
            <button
              onClick={() => setLanguage(language === "EN" ? "ID" : "EN")}
              className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono text-slate-300 flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-theme-accent" />
              <span>LANG: <strong className="text-white">{language}</strong></span>
            </button>

            {/* Mobile Notifications Console Bell */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-mono text-slate-300 flex items-center justify-center space-x-1.5 transition-colors relative cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-theme-accent" />
              <span>ALERTS ({notifications.length})</span>
              {notifications.length > 0 && (
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse absolute top-1 right-2" />
              )}
            </button>
          </div>

          {/* Mobile Theme Selector */}
          <div className="border-t border-white/5 pt-5 space-y-2">
            <span className="block text-[9px] font-mono text-theme-accent uppercase tracking-widest px-1 font-bold">
              Aesthetic Theme
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "cyberpunk", label: "NEON", dot: "bg-cyan-400" },
                { id: "navy", label: "NAVY", dot: "bg-blue-500" },
                { id: "green", label: "GREEN", dot: "bg-emerald-400" }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`py-2 px-1 border rounded-xl text-[10px] font-mono flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer ${
                    theme === t.id 
                      ? "border-theme-accent/50 bg-white/5 text-white font-bold" 
                      : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Integrated Console alert logs inside the drawer */}
          {showNotifications && (
            <div className="p-3 bg-slate-950 border border-white/5 rounded-xl space-y-2 max-h-48 overflow-y-auto font-mono text-[9px] animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-[8px] text-cyan-400 border-b border-white/5 pb-1 mb-1 font-bold">
                <span>CONSOLE ALERT LOGS</span>
                <button onClick={() => setNotifications([])} className="text-red-400 hover:underline">Clear</button>
              </div>
              {notifications.length === 0 ? (
                <div className="text-slate-500 text-center py-2">No active alerts on pipeline.</div>
              ) : (
                notifications.map((notif, idx) => (
                  <div key={idx} className="text-slate-400 leading-relaxed border-b border-white/5 pb-1 last:border-0">
                    &gt; {notif}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Vertical Dot Navigation Indicator */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center space-y-4 bg-white/5 backdrop-blur-md px-2.5 py-5 rounded-full border border-white/10 shadow-lg">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              title={item.label}
            >
              {/* Tooltip */}
              <span className="opacity-0 group-hover:opacity-100 pointer-events-none absolute right-8 font-mono text-[9px] tracking-widest uppercase bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 whitespace-nowrap transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-lg">
                {item.label}
              </span>
              
              {/* Dot outer ring */}
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? "border border-cyan-400/50" 
                  : "border border-transparent group-hover:border-white/20"
              }`}>
                {/* Dot inner body */}
                <div className={`rounded-full transition-all duration-300 ${
                  isActive 
                    ? "w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] scale-110" 
                    : "w-1.5 h-1.5 bg-white/20 group-hover:bg-cyan-400/60"
                }`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Primary Application Render Container */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {children}
      </main>

      {/* Footer Element */}
      <footer className="w-full glass-panel border-t border-white/5 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} ANDRIANUS MARIA // CODENAME: Grand Architect</span>
            <p className="text-[10px] text-slate-600 mt-1">Built with React 19, Tailwind CSS v4 & Gemini Core Reasoning</p>
          </div>
          <div className="flex space-x-6">
            <a 
              href="mailto:andrianus.maria@idstar.group" 
              className="hover:text-cyan-400 transition-colors"
            >
              EMAIL
            </a>
            <a 
              href="https://github.com/andrianus-maria" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-cyan-400 transition-colors"
            >
              GITHUB
            </a>
            <button 
              onClick={() => setActiveSection("admin")} 
              className="hover:text-cyan-400 transition-colors"
            >
              CONSOLE
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
