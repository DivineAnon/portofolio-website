export interface UserProfile {
  name: string;
  title: string;
  xp: number;
  level: number;
  badges: Badge[];
  completedMissions: string[];
  bookmarks: string[];
  viewedProjects: string[];
  scores: Record<string, number>;
  avatar: string;
  rank: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  dateUnlocked?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Web' | 'Mobile' | 'Desktop' | 'AI' | 'Backend' | 'DevOps' | 'Game';
  tags: string[];
  image: string;
  video?: string;
  github?: string;
  demo?: string;
  metrics: {
    performance: string; // e.g., "99%"
    seo: string;
    accessibility: string;
    lighthouse: string;
  };
  caseStudy?: {
    challenge: string;
    solution: string;
    impact: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  readingTime: string;
  date: string;
  likes: number;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  size: 'small' | 'medium' | 'large';
}

export interface TimelineItem {
  id: string;
  type: 'experience' | 'education';
  title: string;
  organization: string;
  period: string;
  description: string;
  highlights: string[];
  logo: string; // Dynamic letter/icon color
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  badgeId?: string;
  category: 'exploration' | 'mini-games' | 'ai' | 'social';
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  badgeId?: string;
  status: 'locked' | 'active' | 'completed';
}
