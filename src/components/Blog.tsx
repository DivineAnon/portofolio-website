import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  Heart, Bookmark, MessageCircle, Calendar, Clock, Share2, Search, X, CheckSquare
} from "lucide-react";
import { BlogPost, UserProfile, BlogComment } from "../types/portfolio";
import { BLOGS_DATA } from "../data/portfolioData";
import { useRenderTracker } from "../hooks/useRenderTracker";

interface BlogProps {
  userProfile: UserProfile;
  addXP: (amount: number, reason: string) => void;
  language: "EN" | "ID";
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
}

export default function Blog({
  userProfile,
  addXP,
  language,
  bookmarks,
  toggleBookmark
}: BlogProps) {
  useRenderTracker("blog");
  const [activeBlog, setActiveBlog] = useState<BlogPost | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    "microservices-patterns": 42,
    "laravel-redis-caching": 35,
    "devops-kubernetes-setup": 56
  });
  const [likedBlogs, setLikedBlogs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "bookmarks">("all");

  const incrementLikes = (blogId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedBlogs.includes(blogId)) return;
    setLikesCount(prev => ({ ...prev, [blogId]: prev[blogId] + 1 }));
    setLikedBlogs(prev => [...prev, blogId]);
    addXP(15, `Liked article ${blogId}`);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeBlog) return;

    const newComment: BlogComment = {
      id: Math.random().toString(),
      author: userProfile.name || "Guest Developer",
      text: commentInput,
      date: "Today"
    };

    activeBlog.comments.push(newComment);
    setCommentInput("");
    addXP(25, "Submitted technical comment on insights article.");
  };

  const openBlogReader = (blog: BlogPost) => {
    setActiveBlog(blog);
    addXP(40, `Synchronized article contents: ${blog.title}`);
  };

  const shareArticle = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: title, url: window.location.href }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("Article link copied to dashboard clipboard!");
    }
    addXP(10, `Shared article ${title}`);
  };

  const displayedBlogs = activeTab === "all" 
    ? BLOGS_DATA 
    : BLOGS_DATA.filter(b => bookmarks.includes(b.id));

  return (
    <div className="py-8 space-y-12 animate-in fade-in slide-in-from-bottom duration-500">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {language === "EN" ? "Insights & Logs" : "Catatan Teknis & Artikel"}
        </h2>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">
          {language === "EN" ? "Detailed logs on microservices, server configs & modern frameworks" : "Artikel detail seputar microservices, konfigurasi server & framework modern"}
        </p>
      </div>

      {/* Grid Filter selectors & Bookmark status */}
      <div className="flex justify-center border-b border-white/5 pb-4 max-w-lg mx-auto font-mono text-xs">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 text-center border-b-2 font-bold uppercase transition-all ${
            activeTab === "all" ? "text-cyan-400 border-cyan-400" : "text-slate-500 border-transparent hover:text-white"
          }`}
        >
          {language === "EN" ? "All Logs" : "Semua Log"}
        </button>
        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`flex-1 py-2 text-center border-b-2 font-bold uppercase transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === "bookmarks" ? "text-cyan-400 border-cyan-400" : "text-slate-500 border-transparent hover:text-white"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>{language === "EN" ? "Bookmarks" : "Disimpan"} ({bookmarks.length})</span>
        </button>
      </div>

      {/* Blogs list */}
      {displayedBlogs.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.01] border border-white/5 rounded-2xl max-w-lg mx-auto font-mono text-xs text-slate-500">
          No logs found inside selected channel.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {displayedBlogs.map((b) => (
            <div
              key={b.id}
              onClick={() => openBlogReader(b)}
              className="glass-panel rounded-2xl border border-white/5 hover:border-cyan-500/20 hover:scale-[1.01] transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              
              {/* Blog Metadata Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{b.date}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{b.readingTime}</span>
                  </span>
                </div>

                {/* Cover heading */}
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-white text-base group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>

              {/* Action and feedback footer */}
              <div className="border-t border-white/5 pt-4 mt-6 flex items-center justify-between text-slate-400 text-xs font-mono">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => incrementLikes(b.id, e)}
                    className={`flex items-center space-x-1 ${likedBlogs.includes(b.id) ? "text-red-500" : "hover:text-red-400"}`}
                  >
                    <Heart className={`w-4 h-4 ${likedBlogs.includes(b.id) ? "fill-current" : ""}`} />
                    <span>{likesCount[b.id]}</span>
                  </button>
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{b.comments.length}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(b.id);
                    }}
                    className={`p-1 hover:text-cyan-400 ${bookmarks.includes(b.id) ? "text-cyan-400" : ""}`}
                    title="Bookmark log"
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarks.includes(b.id) ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={(e) => shareArticle(b.title, e)}
                    className="p-1 hover:text-cyan-400"
                    title="Copy share link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Immersive Markdown Article Reader overlay */}
      {activeBlog && createPortal(
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-3xl rounded-2xl p-6 border border-white/15 shadow-2xl relative overflow-y-auto max-h-[90vh] space-y-6">
            
            {/* Reader close */}
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Title / Header logs */}
            <div className="border-b border-white/5 pb-4 space-y-3">
              <div className="flex items-center space-x-4 text-xs font-mono text-cyan-400">
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 uppercase font-bold text-[9px]">
                  {activeBlog.category}
                </span>
                <span>{activeBlog.date}</span>
                <span>{activeBlog.readingTime}</span>
              </div>
              <h2 className="font-display font-extrabold text-white text-2xl sm:text-3xl">
                {activeBlog.title}
              </h2>
            </div>

            {/* Simulated Markdown body parser */}
            <div className="prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed text-sm sm:text-base space-y-4">
              <p>{activeBlog.description}</p>
              
              {/* Fake render formatted text block based on the mock data */}
              <div className="bg-slate-950 p-4 border border-white/5 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre leading-normal my-4">
                {activeBlog.id === "microservices-patterns" ? (
                  `// Express / Node.js Kafka Consumer Example
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'analytics-worker',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-clicks' });
}`
                ) : (
                  `// Caching evaporative configurations in Laravel
use Illuminate\\Support\\Facades\\Cache;

$products = Cache::tags(['products'])->remember('page_1', 3600, function () {
    return Product::where('active', true)->paginate(15);
});`
                )}
              </div>
            </div>

            {/* Action and social interactions */}
            <div className="border-t border-white/5 pt-4">
              <h4 className="font-display font-bold text-white text-sm mb-3">
                {language === "EN" ? "Interactive Diagnostics Console (Comments)" : "Konsol Diagnostik Interaktif (Komentar)"}
              </h4>

              {/* Comments form list */}
              <div className="space-y-3 mb-4">
                {activeBlog.comments.map((c) => (
                  <div key={c.id} className="bg-slate-950/60 p-3 border border-white/5 rounded-xl font-mono text-[11px] space-y-1">
                    <div className="flex justify-between items-center text-slate-500">
                      <span className="font-bold text-cyan-400">&gt; {c.author}</span>
                      <span>{c.date}</span>
                    </div>
                    <p className="text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Submit text */}
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder={language === "EN" ? "Input custom comment string..." : "Tulis komentar..."}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="flex-grow bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-white outline-none focus:border-cyan-500/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-xl font-mono text-xs font-bold hover:bg-cyan-500/20"
                >
                  SEND
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
