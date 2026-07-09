import { useState } from "react";
import { 
  ChevronLeft, ChevronRight, Quote, Star, Sparkles
} from "lucide-react";
import { UserProfile } from "../types/portfolio";

interface TestimonialsProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
}

export default function Testimonials({
  userProfile,
  addXP,
  language
}: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews = [
    {
      id: "t1",
      name: "Suryawan Santoso",
      role: "VP of Engineering @ FinTech Corp",
      review: "Andrianus led our legacy monolith migration project flawlessly. He brought complete calm and structured solutions to what had been a chaotic technical challenge. The Kafka queues he integrated easily handle peak transaction bursts of 10,000 requests/sec with zero latency bottlenecks.",
      rating: 5,
      avatar: "SS"
    },
    {
      id: "t2",
      name: "Jeanette Dubois",
      role: "Lead Agile Coach @ TechLabs",
      review: "Andrianus possesses a magnificent balance of rigorous system architecture wisdom and clean intuitive frontend execution. He operates with high executive ownership, mentors junior devs patiently, and maintains full documentation standards.",
      rating: 5,
      avatar: "JD"
    },
    {
      id: "t3",
      name: "Rian Prasetya",
      role: "Founder @ Nexa Indonesia",
      review: "We hired Andrianus to audit our GCP/Kubernetes cluster configuration ahead of our series A launch. He reduced our cluster cloud bill by 35% through container compaction, while making our pipelines twice as fast. Highly recommended developer!",
      rating: 5,
      avatar: "RP"
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    addXP(10, "Swiped through client testimonials.");
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    addXP(10, "Swiped through client testimonials.");
  };

  const currentReview = reviews[currentIndex];

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Collaborator Briefings" : "Testimoni Kolaborator"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "Real feedback from peer developers & technical managers" : "Umpan balik nyata dari sesama developer & manajer teknis"}
        </p>
      </div>

      {/* Testimonial slider card */}
      <div className="relative max-w-4xl mx-auto">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/5 shadow-2xl space-y-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          
          {/* Subtle quote overlay decoration */}
          <div className="absolute -top-6 -right-6 w-36 h-36 opacity-5 pointer-events-none text-cyan-400">
            <Quote className="w-full h-full rotate-180" />
          </div>

          {/* Rating stars */}
          <div className="flex items-center space-x-1">
            {[...Array(currentReview.rating)].map((_, idx) => (
              <Star key={idx} className="w-4 h-4 text-cyan-400 fill-current" />
            ))}
            <span className="text-[10px] font-mono text-cyan-400/80 ml-2">VERIFIED REVIEWS</span>
          </div>

          {/* Review body */}
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-sans italic relative z-10">
            &ldquo;{currentReview.review}&rdquo;
          </p>

          {/* Client profile info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/5 pt-6 mt-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center font-display font-bold text-sm shadow-md shadow-cyan-500/10">
                {currentReview.avatar}
              </div>
              <div>
                <h4 className="font-display font-bold text-white text-sm sm:text-base leading-none">
                  {currentReview.name}
                </h4>
                <span className="text-[10.5px] font-mono text-slate-500 uppercase mt-1 block tracking-wider">
                  {currentReview.role}
                </span>
              </div>
            </div>

            {/* Slider Toggles */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-2 sm:p-2.5 rounded-lg bg-slate-950 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Previous feedback slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <span className="text-[11px] font-mono text-slate-500 px-2 select-none">
                {currentIndex + 1} / {reviews.length}
              </span>

              <button
                onClick={handleNext}
                className="p-2 sm:p-2.5 rounded-lg bg-slate-950 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Next feedback slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
