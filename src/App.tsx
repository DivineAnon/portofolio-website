import { useState, useEffect, useRef } from "react";
import { 
  Bot, Award, Sparkles, MessageSquare, Terminal, RefreshCw, X
} from "lucide-react";

// Components Imports
import Layout from "./components/Layout";
import ParticleBackground from "./components/ParticleBackground";
import Hero from "./components/Hero";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Blog from "./components/Blog";
import Gallery from "./components/Gallery";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import AIChat from "./components/AIChat";
import FunZone from "./components/FunZone";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";
import LevelUpModal from "./components/LevelUpModal";

// Types
import { UserProfile, Badge, Mission } from "./types/portfolio";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [language, setLanguage] = useState<"EN" | "ID">("EN");
  const [theme, setTheme] = useState<"cyberpunk" | "navy" | "green">("cyberpunk");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Gamified User Profile states
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Guest Developer",
    level: 1,
    xp: 250,
    badges: [],
    rank: "Junior Systems Analyst"
  });

  const [highlightBadge, setHighlightBadge] = useState(false);
  const [isLevelUpOpen, setIsLevelUpOpen] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; oldLevel: number; rank: string } | null>(null);
  const [recentMilestones, setRecentMilestones] = useState<string[]>([]);

  // Gamified active missions list
  const [activeMissions, setActiveMissions] = useState<Mission[]>([
    { id: "compile-code", title: "Compile Codebase", description: "Trigger the custom compiler simulation on the home page.", xpReward: 100, status: "active" },
    { id: "play-game", title: "Acquire Quest Intel", description: "Activate any mini-game inside the Developer Quest Zone.", xpReward: 150, status: "active" },
    { id: "chat-ai", title: "Cognitive AI Sync", description: "Transmit a custom query inside the Gemini Assistant console.", xpReward: 120, status: "active" }
  ]);

  // Daily Missions System
  const [dailyMissions, setDailyMissions] = useState<Mission[]>([]);
  const [nextResetTime, setNextResetTime] = useState<number>(0);

  const DAILY_MISSIONS_POOL: Omit<Mission, "status">[] = [
    { id: "daily-snake", title: "Neon Slither", description: "Achieve a score of at least 3 blocks in the Neon Snake game.", xpReward: 120 },
    { id: "daily-memory", title: "Memory Sync", description: "Launch and complete the Memory Card Matrix puzzle.", xpReward: 140 },
    { id: "daily-trivia", title: "Trivia Scholar", description: "Answer at least one trivia question correctly inside Tech Trivia.", xpReward: 110 },
    { id: "daily-bug-hunter", title: "Logical Bug Hunt", description: "Find a syntax/logical bug successfully in Bug Hunter Cops.", xpReward: 130 },
    { id: "daily-code-puzzle", title: "Pipeline Builder", description: "Re-arrange code fragments to build the Router Code Assembly pipeline.", xpReward: 150 },
    { id: "daily-escape-hacker", title: "Hacker Defense", description: "Decrypt the passcode and bypass the cyber firewall in Escape The Hacker.", xpReward: 180 },
    { id: "daily-chat-ai", title: "Synapse Sync", description: "Synchronize with the Gemini AI Assistant by opening its console.", xpReward: 100 },
    { id: "daily-bookmark", title: "Knowledge Saver", description: "Save or toggle any blog post bookmark for future developer reference.", xpReward: 90 },
    { id: "daily-feedback", title: "Feed the Pipeline", description: "Submit a contact form message to record user feedback.", xpReward: 110 },
    { id: "daily-compile", title: "Core Compiler Boot", description: "Compile the codebase by clicking 'Run Diagnostics' on the Home hero page.", xpReward: 100 }
  ];

  const generateDailyMissions = (force = false) => {
    const now = Date.now();
    const newResetTime = now + 24 * 60 * 60 * 1000; // 24 hours from now
    
    // Select 3 random unique missions from the pool
    const shuffled = [...DAILY_MISSIONS_POOL].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3).map(m => ({
      ...m,
      status: "active" as const
    }));
    
    setDailyMissions(selected);
    setNextResetTime(newResetTime);
    localStorage.setItem("andrianus_daily_missions", JSON.stringify(selected));
    localStorage.setItem("andrianus_daily_missions_reset_time", newResetTime.toString());
    
    if (!force) {
      addXP(50, "Daily missions refreshed!");
    }
  };

  // Easter Egg parameters
  const [easterEggGlitched, setEasterEggGlitched] = useState(false);

  // Load cache on init
  useEffect(() => {
    const savedTheme = localStorage.getItem("andrianus_theme") as "cyberpunk" | "navy" | "green" | null;
    if (savedTheme && ["cyberpunk", "navy", "green"].includes(savedTheme)) {
      setTheme(savedTheme);
    }

    const savedProfile = localStorage.getItem("andrianus_user_profile");
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.warn("Could not retrieve user cache profile.");
      }
    }
    const savedBookmarks = localStorage.getItem("andrianus_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.warn("Could not retrieve bookmarks cache.");
      }
    }

    // Daily missions checking
    const savedDailyMissions = localStorage.getItem("andrianus_daily_missions");
    const savedResetTime = localStorage.getItem("andrianus_daily_missions_reset_time");
    const now = Date.now();
    let resetTime = savedResetTime ? parseInt(savedResetTime, 10) : 0;

    if (savedDailyMissions && resetTime > now) {
      try {
        setDailyMissions(JSON.parse(savedDailyMissions));
        setNextResetTime(resetTime);
      } catch (e) {
        console.warn("Could not retrieve daily missions cache.");
        generateDailyMissions(true);
      }
    } else {
      generateDailyMissions(true);
    }
  }, []);

  // Save changes to local storage
  const saveProfileToCache = (updatedProfile: UserProfile) => {
    localStorage.setItem("andrianus_user_profile", JSON.stringify(updatedProfile));
  };

  const handleThemeChange = (newTheme: "cyberpunk" | "navy" | "green") => {
    setTheme(newTheme);
    localStorage.setItem("andrianus_theme", newTheme);
  };

  const addXP = (amount: number, reason: string) => {
    // Intercept event strings to trigger active and daily missions completion
    if (reason.includes("Successfully compiled Andrianus's live codebase")) {
      completeMission("compile-code");
      completeMission("daily-compile");
    }
    if (reason.includes("Finished Neon Snake")) {
      if (amount >= 15) { // Score >= 3
        completeMission("daily-snake");
      }
    }
    if (reason.includes("Completed Memory Matrix")) {
      completeMission("daily-memory");
    }
    if (reason.includes("Correctly resolved tech trivia query")) {
      completeMission("daily-trivia");
    }
    if (reason.includes("Successfully audited logical software bug")) {
      completeMission("daily-bug-hunter");
    }
    if (reason.includes("Assembled Redis caching configuration puzzle")) {
      completeMission("daily-code-puzzle");
    }
    if (reason.includes("Successfully escaped hacker infiltration")) {
      completeMission("daily-escape-hacker");
    }
    if (reason.includes("Toggled bookmark")) {
      completeMission("daily-bookmark");
    }
    if (reason.includes("Submitted contact message") || reason.includes("feedback")) {
      completeMission("daily-feedback");
    }

    if (reason) {
      setRecentMilestones((prev) => {
        // Humanize reasons slightly if appropriate or log them directly
        const cleanReason = reason.replace("Completed Daily Mission: ", "").replace("Completed quest mission: ", "");
        if (prev.includes(cleanReason)) return prev;
        return [cleanReason, ...prev].slice(0, 5);
      });
    }

    setUserProfile((prev) => {
      const newXp = prev.xp + amount;
      const currentLevel = prev.level;
      const calculatedLevel = Math.floor(newXp / 1000) + 1;
      
      let rank = "Junior Systems Analyst";
      if (calculatedLevel >= 8) {
        rank = "Lead Principal Architect";
      } else if (calculatedLevel >= 4) {
        rank = "Senior System Engineer";
      } else if (calculatedLevel >= 2) {
        rank = "Systems Analyst";
      }

      if (calculatedLevel > currentLevel) {
        // Trigger Level Up celebratory modal outside of rendering cycle
        setTimeout(() => {
          setLevelUpInfo({
            level: calculatedLevel,
            oldLevel: currentLevel,
            rank
          });
          setIsLevelUpOpen(true);
        }, 100);
      }

      const updated = {
        ...prev,
        xp: newXp,
        level: calculatedLevel,
        rank
      };
      
      saveProfileToCache(updated);
      return updated;
    });
  };

  const unlockBadge = (badgeId: string, title: string, description: string, icon: string, color: string) => {
    setUserProfile((prev) => {
      if (prev.badges.some(b => b.id === badgeId)) return prev;

      const newBadge: Badge = { id: badgeId, title, description, icon, color };
      const updated = {
        ...prev,
        badges: [...prev.badges, newBadge]
      };
      
      saveProfileToCache(updated);
      
      // Trigger badge section highlight effect for 5 seconds
      setHighlightBadge(true);
      setTimeout(() => {
        setHighlightBadge(false);
      }, 5000);

      return updated;
    });
  };

  const playSuccessSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      // Note 1 (First chime element)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // slide to G5
      
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.12, now + 0.03);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2 (Higher secondary chime element, delayed slightly for melody)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.2); // slide to C6
      
      gain2.gain.setValueAtTime(0, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.08, now + 0.11);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn("Web Audio chime failed to initialize or execute:", e);
    }
  };

  const completeMission = (missionId: string) => {
    // Check if the mission is actually active before completing it
    const isStandardActive = activeMissions.some((m) => m.id === missionId && m.status === "active");
    const isDailyActive = dailyMissions.some((m) => m.id === missionId && m.status === "active");

    if (isStandardActive || isDailyActive) {
      playSuccessSound();
    }

    // 1. Check active standard missions
    setActiveMissions((prev) => 
      prev.map((m) => {
        if (m.id === missionId && m.status === "active") {
          addXP(m.xpReward, `Completed quest mission: ${m.title}`);
          return { ...m, status: "completed" };
        }
        return m;
      })
    );

    // 2. Check active daily missions
    setDailyMissions((prev) => {
      let updatedStatus = false;
      const nextMissions = prev.map((m) => {
        if (m.id === missionId && m.status === "active") {
          addXP(m.xpReward, `Completed Daily Mission: ${m.title}`);
          updatedStatus = true;
          return { ...m, status: "completed" };
        }
        return m;
      });
      if (updatedStatus) {
        localStorage.setItem("andrianus_daily_missions", JSON.stringify(nextMissions));
      }
      return nextMissions;
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(id) 
        ? prev.filter((bId) => bId !== id) 
        : [...prev, id];
      localStorage.setItem("andrianus_bookmarks", JSON.stringify(updated));
      addXP(10, "Toggled bookmark saved log status.");
      return updated;
    });
  };

  const updateProfileName = (newName: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, name: newName };
      saveProfileToCache(updated);
      return updated;
    });
  };

  const handleNewContactMessage = (msg: any) => {
    setMessages((prev) => [msg, ...prev]);
  };

  const triggerEasterEgg = () => {
    setEasterEggGlitched(true);
    addXP(100, "Triggered security easter egg glitch.");
    setTimeout(() => {
      setEasterEggGlitched(false);
    }, 4000);
  };

  // Auto trigger chat mission complete when user opens it
  const handleOpenAIChat = () => {
    setIsAIChatOpen(true);
    completeMission("chat-ai");
  };

  const isProgrammaticScroll = useRef(false);

  const handleSectionChange = (sec: string) => {
    isProgrammaticScroll.current = true;
    setActiveSection(sec);
    const targetElement = document.getElementById(`section-${sec}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 1000);
  };

  // Intersection Observer to update activeSection state on scroll
  useEffect(() => {
    const sections = ["hero", "about", "portfolio", "blog", "fun-zone", "dashboard", "admin"];
    const observers = sections.map((id) => {
      const el = document.getElementById(`section-${id}`);
      return { id, el };
    });

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isProgrammaticScroll.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.replace("section-", "");
          setActiveSection(sectionId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    observers.forEach(({ el }) => {
      if (el) observer.observe(el);
    });

    return () => {
      observers.forEach(({ el }) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <Layout
      userProfile={userProfile}
      activeSection={activeSection}
      setActiveSection={handleSectionChange}
      onSearch={setSearchQuery}
      language={language}
      setLanguage={setLanguage}
      theme={theme}
      setTheme={handleThemeChange}
    >
      {/* Global Canvas Particle background */}
      <ParticleBackground theme={theme} />

      {/* Easter Egg Glitch overlay screen */}
      {easterEggGlitched && (
        <div className="fixed inset-0 bg-red-950/90 border-4 border-red-500/30 z-50 flex items-center justify-center font-mono text-xs text-red-400 p-6 animate-pulse select-none">
          <div className="text-center space-y-4 max-w-md">
            <span className="text-lg font-bold block">!!! ALARM: SECURITY_INTRUSION_LOG !!!</span>
            <p className="text-[11px] leading-relaxed">
              Backdoor security breach leaked at host port:3000. Decrypt passcode values inside the Quest Fun Zone immediately to restore database firewalls.
            </p>
            <span className="block text-[10px] text-slate-500">Auto-restoring in 4 seconds...</span>
          </div>
        </div>
      )}

      {/* Sections views router */}
      <div className="w-full relative z-10 min-h-[60vh] space-y-32">
        <div id="section-hero" className="scroll-mt-24">
          <Hero
            userProfile={userProfile}
            addXP={addXP}
            setActiveSection={handleSectionChange}
            language={language}
            setLanguage={setLanguage}
            triggerEasterEgg={triggerEasterEgg}
          />
        </div>

        <div id="section-about" className="scroll-mt-24">
          <About
            userProfile={userProfile}
            addXP={addXP}
            language={language}
          />
        </div>

        <div id="section-portfolio" className="scroll-mt-24">
          <Portfolio
            userProfile={userProfile}
            addXP={addXP}
            language={language}
            searchQuery={searchQuery}
          />
        </div>

        <div id="section-blog" className="scroll-mt-24">
          <Blog
            userProfile={userProfile}
            addXP={addXP}
            language={language}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
          />
        </div>

        <div id="section-fun-zone" className="scroll-mt-24">
          <FunZone
            userProfile={userProfile}
            addXP={addXP}
            language={language}
            unlockBadge={unlockBadge}
            activeMissions={activeMissions}
            completeMission={completeMission}
            dailyMissions={dailyMissions}
            nextResetTime={nextResetTime}
            triggerManualReset={() => generateDailyMissions(false)}
          />
        </div>

        <div id="section-dashboard" className="scroll-mt-24">
          <Dashboard
            userProfile={userProfile}
            addXP={addXP}
            language={language}
            bookmarks={bookmarks}
            setActiveSection={handleSectionChange}
            updateProfileName={updateProfileName}
            highlightBadge={highlightBadge}
          />
        </div>

        <div id="section-admin" className="scroll-mt-24">
          <AdminPanel
            userProfile={userProfile}
            language={language}
            messages={messages}
          />
        </div>
      </div>

      {/* Floating Cognitive AI Assistant launcher button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleOpenAIChat}
          className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white shadow-xl shadow-cyan-500/20 hover:scale-105 hover:shadow-cyan-400/35 active:scale-95 transition-all flex items-center justify-center relative group cursor-pointer border border-white/10"
          title="Connect with Gemini AI Assistant"
        >
          <Bot className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Animated ping glow around floating chat launcher */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
          </span>
        </button>
      </div>

      {/* Gemini AI Assistant overlay */}
      <AIChat
        userProfile={userProfile}
        addXP={addXP}
        language={language}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Embedded sections: Testimonials & Contacts inside layout footer block */}
      <div className="mt-32 border-t border-white/5 pt-20 space-y-24">
        <Testimonials
          userProfile={userProfile}
          addXP={addXP}
          language={language}
        />
        
        <Contact
          userProfile={userProfile}
          addXP={addXP}
          language={language}
          onNewMessage={handleNewContactMessage}
        />
      </div>

      {/* Level Up Celebration Modal Overlay */}
      <LevelUpModal
        isOpen={isLevelUpOpen}
        onClose={() => setIsLevelUpOpen(false)}
        level={levelUpInfo?.level || userProfile.level}
        rank={levelUpInfo?.rank || userProfile.rank}
        oldLevel={levelUpInfo?.oldLevel || (userProfile.level - 1 || 1)}
        recentMilestones={recentMilestones}
      />
    </Layout>
  );
}
