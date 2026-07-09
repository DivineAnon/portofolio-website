import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Bot, Sparkles, User, Mic, MicOff, Volume2, VolumeX, ShieldAlert, Cpu, ArrowLeft, RefreshCw
} from "lucide-react";
import { UserProfile } from "../types/portfolio";

interface AIChatProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
  isOpen: boolean;
  onClose: () => void;
}

export default function AIChat({
  userProfile,
  addXP,
  language,
  isOpen,
  onClose
}: AIChatProps) {
  const [messages, setMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: `Welcome **${userProfile.name || "Developer"}**. I am Gemini, the server-side AI Assistant representing Andrianus's professional credentials. 
    
Ask me anything about his core technical skills, experience timeline, Kubernetes architectures, or how to recruit him!` }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Voice Synthesis and recognition parameters
  const [isListening, setIsListening] = useState(false);
  const [ttsActive, setTtsActive] = useState(true);
  const recognitionRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Init web speech recognition safely
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === "EN" ? "en-US" : "id-ID";

      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setInputMessage(text);
        setIsListening(false);
        addXP(20, "Used Voice input dictation in AI chat.");
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setIsListening(false);
      };

      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, [language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported on this browser context.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Browser speech synthesis playback
  const speakText = (text: string) => {
    if (!ttsActive) return;
    try {
      window.speechSynthesis.cancel(); // Cancel current synthesis
      // Clean markdown tags for nicer speaking
      const plainText = text.replace(/[*#\`_]/g, "");
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = language === "EN" ? "en-US" : "id-ID";
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis failed:", e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isGenerating) return;

    const userText = inputMessage;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.map(m => ({ role: m.sender === "user" ? "user" : "model", parts: [{ text: m.text }] }))
        })
      });

      const data = await response.json();
      if (data.text) {
        setMessages(prev => [...prev, { sender: "ai", text: data.text }]);
        speakText(data.text);
        addXP(30, "Conversed with Andrianus AI Assistant.");
      } else {
        throw new Error("Invalid backend format response");
      }
    } catch (error) {
      console.error("AI Assistant error:", error);
      const fallbackMsg = "System Error: Callback node unreachable. Ensure the Gemini API key is registered inside standard secrets or continue in local simulation panels.";
      setMessages(prev => [...prev, { sender: "ai", text: fallbackMsg }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const sampleQuestions = [
    language === "EN" ? "What is Andrianus's technical stack?" : "Apa saja keahlian teknis Andrianus?",
    language === "EN" ? "Tell me about Nebula Core project" : "Jelaskan seputar proyek Nebula Core",
    language === "EN" ? "How can I recruit Andrianus?" : "Bagaimana cara merekrut Andrianus?"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-0 md:p-6 animate-in fade-in duration-300">
      
      {/* Immersive Chat Panel grid */}
      <div className="w-full h-full md:max-w-4xl md:h-[85vh] glass-panel md:rounded-3xl border border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl relative">
        
        {/* Glowing floating orbs in chat background */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-950/10 rounded-full glow-blur pointer-events-none -z-10" />

        {/* Chat Header controls */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-slate-900/40 relative z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <h3 className="font-display font-bold text-white text-sm sm:text-base leading-none">GEMINI INTELLIGENCE CORE</h3>
                <span className="text-[9px] font-mono text-cyan-400 tracking-wider">SECURED ENDPOINT // VITE SHIELD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* TTS Mute toggler */}
            <button
              onClick={() => {
                setTtsActive(!ttsActive);
                if (ttsActive) window.speechSynthesis.cancel();
              }}
              className={`p-2 rounded-lg transition-colors ${ttsActive ? "text-cyan-400 bg-cyan-500/10" : "text-slate-500 hover:text-white bg-white/5"}`}
              title="Toggle Text-to-Speech voice answers"
            >
              {ttsActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Chat Conversation Stream scroll area */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4 font-mono text-xs leading-normal">
          {messages.map((m, idx) => (
            <div 
              key={idx}
              className={`flex items-start gap-3.5 max-w-2xl ${m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              <div className={`p-2.5 rounded-xl ${m.sender === "user" ? "bg-cyan-500/20 border border-cyan-500/30 text-white" : "bg-white/5 border border-white/5 text-slate-300"}`}>
                {m.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-cyan-400" />}
              </div>
              <div className={`p-4 rounded-2xl relative text-xs ${m.sender === "user" ? "bg-cyan-900/10 text-cyan-200 border border-cyan-500/10" : "bg-slate-900/60 text-slate-200 border border-white/5"}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex items-start gap-3.5 max-w-2xl mr-auto">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span className="animate-pulse">Retrieving Gemini parameters...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Diagnostic Prompts block */}
        <div className="px-6 py-2 flex flex-wrap gap-2 justify-center font-mono text-[10px]">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => { setInputMessage(q); addXP(5, "Selected suggested FAQ query."); }}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/20 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Interactive Message transmission console input */}
        <div className="p-6 border-t border-white/5 bg-slate-900/20">
          <form onSubmit={handleSendMessage} className="flex gap-2.5 items-center">
            
            {/* Speech recognition mic */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${isListening ? "bg-red-500/10 text-red-400 border-red-500/35 animate-pulse" : "bg-white/5 border-white/5 text-slate-400 hover:text-white"}`}
              title="Speak message"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              required
              placeholder={language === "EN" ? "Type system inquiry prompt..." : "Tulis perintah sistem..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-5 py-3 text-xs font-mono text-white outline-none focus:border-cyan-500/40"
            />
            
            <button
              type="submit"
              disabled={isGenerating}
              className="p-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl hover:shadow-cyan-500/15 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
