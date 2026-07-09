import React, { useState } from "react";
import { 
  X, ZoomIn, Heart, Layers, ShieldAlert
} from "lucide-react";
import { GalleryItem, UserProfile } from "../types/portfolio";
import { GALLERY_DATA } from "../data/portfolioData";

interface GalleryProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
}

export default function Gallery({
  userProfile,
  addXP,
  language
}: GalleryProps) {
  const [activeLightboxImage, setActiveLightboxImage] = useState<GalleryItem | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({
    g1: 24, g2: 52, g3: 18, g4: 31
  });
  const [likedList, setLikedList] = useState<string[]>([]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedList.includes(id)) return;
    setLikes(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setLikedList(prev => [...prev, id]);
    addXP(15, "Liked gallery image");
  };

  const triggerLightbox = (item: GalleryItem) => {
    setActiveLightboxImage(item);
    addXP(20, "Inspected architectural blueprint image");
  };

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Architectural Blueprints" : "Cetak Biru Arsitektur"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "A visual timeline of system models and developer setups" : "Galeri visual model sistem dan setup pengembang"}
        </p>
      </div>

      {/* Grid: Pinterest Masonry Column styles */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {GALLERY_DATA.map((item) => (
          <div
            key={item.id}
            onClick={() => triggerLightbox(item)}
            className="break-inside-avoid glass-panel rounded-2xl border border-white/5 overflow-hidden group cursor-zoom-in relative transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:scale-[1.01]"
          >
            
            {/* Main Picture image */}
            <div className="relative overflow-hidden w-full">
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover opacity-85 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
              />
              {/* 3D Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <span className="text-[10px] font-mono text-cyan-400 block tracking-wider uppercase mb-1">
                  Blueprint // {item.category}
                </span>
                <h4 className="font-display font-bold text-white text-base">
                  {item.title}
                </h4>
                <p className="text-slate-300 text-xs mt-1.5 leading-normal">
                  {item.description}
                </p>

                {/* Like trigger in overlay */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={(e) => toggleLike(item.id, e)}
                    className={`flex items-center space-x-1 text-xs font-mono transition-colors ${likedList.includes(item.id) ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
                  >
                    <Heart className={`w-4 h-4 ${likedList.includes(item.id) ? "fill-current" : ""}`} />
                    <span>{likes[item.id]}</span>
                  </button>
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox popups */}
      {activeLightboxImage && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl glass-panel rounded-2xl p-4 border border-white/10 flex flex-col items-center">
            
            {/* Close lightbox */}
            <button
              onClick={() => setActiveLightboxImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-lg bg-slate-950/80 border border-white/5 text-slate-400 hover:text-white transition-colors z-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Main view */}
            <div className="w-full flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-3/5 overflow-hidden rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center">
                <img
                  src={activeLightboxImage.url}
                  alt={activeLightboxImage.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] object-contain w-full"
                />
              </div>

              {/* Text and interaction block */}
              <div className="w-full md:w-2/5 space-y-4 font-mono text-xs">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
                    System Blueprint Node
                  </span>
                  <h3 className="font-display font-bold text-white text-lg">
                    {activeLightboxImage.title}
                  </h3>
                </div>

                <p className="text-slate-400 leading-relaxed font-sans text-xs sm:text-sm">
                  {activeLightboxImage.description}
                </p>

                {/* Visual debug parameters */}
                <div className="bg-slate-950 p-4 border border-white/5 rounded-xl space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Node Cluster:</span>
                    <span className="text-cyan-400">AWS_ASIA_EAST_1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Image Resolution:</span>
                    <span className="text-slate-300">Ultra-HD // Web Scale</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Eviction State:</span>
                    <span className="text-green-400">PERSISTENT_ACTIVE</span>
                  </div>
                </div>

                {/* Like buttons inside lightbox */}
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <button
                    onClick={(e) => toggleLike(activeLightboxImage.id, e)}
                    className={`flex items-center space-x-1.5 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-xs font-semibold ${likedList.includes(activeLightboxImage.id) ? "text-red-500 border-red-500/20" : "text-slate-400 hover:text-white"}`}
                  >
                    <Heart className={`w-4 h-4 ${likedList.includes(activeLightboxImage.id) ? "fill-current" : ""}`} />
                    <span>{likes[activeLightboxImage.id]} Likes</span>
                  </button>

                  <button
                    onClick={() => setActiveLightboxImage(null)}
                    className="text-slate-500 hover:text-white underline text-[10px]"
                  >
                    Dismiss Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
