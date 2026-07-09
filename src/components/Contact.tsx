import React, { useState } from "react";
import { 
  Mail, Calendar, MessageSquare, Send, CheckCircle, Clock, ShieldAlert, Wifi, Globe, PhoneCall
} from "lucide-react";
import { UserProfile } from "../types/portfolio";

interface ContactProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
  onNewMessage: (msg: any) => void;
}

export default function Contact({
  userProfile,
  addXP,
  language,
  onNewMessage
}: ContactProps) {
  const [formData, setFormData] = useState({ name: "", email: "", msg: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedCalendarSlot, setSelectedCalendarSlot] = useState<string | null>(null);

  const availableSlots = [
    "10:00 AM WIB (Asia/Jakarta)",
    "02:00 PM WIB (Asia/Jakarta)",
    "04:00 PM WIB (Asia/Jakarta)"
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.msg) return;

    // Send data to logs database simulator
    onNewMessage({
      id: Math.random().toString(),
      sender: formData.name,
      email: formData.email,
      text: formData.msg,
      date: new Date().toLocaleDateString()
    });

    setFormSubmitted(true);
    addXP(100, "Submitted contact message to Andrianus.");
  };

  const selectBookingSlot = (slot: string) => {
    setSelectedCalendarSlot(slot);
    addXP(50, `Booked interview slot: ${slot}`);
  };

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Establish Link (Contact)" : "Koneksikan Jalur (Kontak)"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "Initiate direct secure pathways to recruit or book slots" : "Buka saluran komunikasi langsung untuk rekrutmen atau jadwalkan slot"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-bold text-white text-lg flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <span>{language === "EN" ? "Transmit Core Message" : "Kirim Pesan Teknis"}</span>
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm">
              Transmit a compiled message directly to Andrianus's personal console terminal.
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-12 text-center space-y-4 font-mono text-xs text-green-400 animate-in fade-in duration-300">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <p className="font-bold uppercase tracking-widest">MESSAGE TRANSMITTED SUCCESS // OK</p>
              <p className="text-slate-400">Andrianus has received your packet. Response will return via email within 12 hours.</p>
              <button
                onClick={() => { setFormSubmitted(false); setFormData({ name: "", email: "", msg: "" }); }}
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                Send another message packet
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 mt-6 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-widest">Sender ID (Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Recruiter, CEO"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-slate-500 uppercase tracking-widest">Callback Path (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. callback@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 uppercase tracking-widest">Message Payload</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Insert custom message details..."
                  value={formData.msg}
                  onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-500/40 resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-sora font-semibold text-xs rounded-xl hover:shadow-cyan-500/15 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>COMPILE & TRANSMIT MESSAGE</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Calendar Booking & Connection Map */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Calendar booking widget */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span>{language === "EN" ? "Book Alignment Call" : "Jadwalkan Wawancara"}</span>
            </h3>
            <p className="text-slate-400 text-xs leading-normal">
              Book a 15-minute quick alignments sync with Andrianus.
            </p>

            {selectedCalendarSlot ? (
              <div className="bg-purple-950/20 border border-purple-500/20 p-4 rounded-xl font-mono text-xs text-purple-400 space-y-2 animate-in zoom-in duration-300">
                <span className="font-bold">SLOT SECURED // BLOCKED</span>
                <p className="text-slate-400 text-[11px]">You booked {selectedCalendarSlot}. Calendar invite payload transmitted callback paths.</p>
                <button 
                  onClick={() => setSelectedCalendarSlot(null)}
                  className="underline hover:text-purple-300 text-[10px]"
                >
                  Change schedule slot
                </button>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => selectBookingSlot(slot)}
                    className="w-full py-2.5 px-4 rounded-xl border border-white/5 bg-slate-950 hover:border-purple-500/40 hover:text-purple-400 transition-all text-left text-[11px] font-semibold text-slate-300 flex items-center justify-between group cursor-pointer"
                  >
                    <span>{slot}</span>
                    <Clock className="w-3.5 h-3.5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Connection map widget */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
            <h3 className="font-display font-bold text-white text-base flex items-center space-x-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>{language === "EN" ? "Active Cloud Nodes" : "Jalur Server Cloud Aktif"}</span>
            </h3>

            {/* Simulated Live SVG radar node lines */}
            <div className="relative h-28 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:15px_15px]" />
              
              {/* Dynamic SVG pings */}
              <svg className="w-full h-full relative z-10">
                {/* Node 1 Jakarta */}
                <circle cx="50" cy="60" r="4" fill="#06b6d4" className="animate-pulse" />
                <text x="50" y="48" fill="#06b6d4" fontSize="8" fontFamily="monospace">JKT_HOST_01</text>
                
                {/* Connection line */}
                <path d="M 50 60 Q 150 20 250 50" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_5s_linear_infinite]" />
                
                {/* Node 2 AWS SG */}
                <circle cx="250" cy="50" r="3" fill="#2563eb" />
                <text x="210" y="40" fill="#2563eb" fontSize="8" fontFamily="monospace">AWS_SIN_EKS</text>
              </svg>

              <div className="absolute bottom-2 left-3 text-[8px] font-mono text-cyan-400/70 flex items-center space-x-1.5">
                <Wifi className="w-3 h-3 text-cyan-400 animate-bounce" />
                <span>LINK STATUS: SECURED_STABLE</span>
              </div>
            </div>

            {/* Quick WhatsApp Anchor trigger */}
            <a
              href="https://wa.me/628111111111" // Simulated anchor
              target="_blank"
              rel="noreferrer"
              onClick={() => addXP(15, "Initiated WhatsApp communication callback.")}
              className="w-full py-2.5 bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 rounded-xl font-mono text-green-400 text-xs font-bold text-center flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>DIRECT WHATSAPP TRANSMISSION</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
