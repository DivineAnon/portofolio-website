import { Project, BlogPost, GalleryItem, TimelineItem, Achievement, Mission } from "../types/portfolio";

export const PROJECTS_DATA: Project[] = [
  {
    id: "nebula-core",
    title: "Nebula Core",
    description: "Enterprise Microservices Monitoring Dashboard built to oversee container health, system throughput, and live Redis caching pipelines. Integrates deep analytical metrics and custom charting pipelines.",
    category: "AI",
    tags: ["Next.js", "Tailwind CSS v4", "NestJS", "Kafka", "PostgreSQL", "Kubernetes"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
    github: "https://github.com/andrianus-maria/nebula-core",
    demo: "https://nebula.andrianus.web.id",
    metrics: {
      performance: "98%",
      seo: "100%",
      accessibility: "96%",
      lighthouse: "98"
    },
    caseStudy: {
      challenge: "Scaling real-time message telemetry across multiple multi-tenant instances without losing packets during burst peak traffic.",
      solution: "Implemented an event-driven decoupled architecture using Apache Kafka message streaming and optimized Node.js background processors to absorb latency peaks.",
      impact: "Reduced overall system message delivery latency by 55% and supported 3M+ active stream metrics daily with zero data loss."
    }
  },
  {
    id: "quant-iq",
    title: "QuantIQ Trading Engine",
    description: "A high-performance algorithmic trading platform leveraging Gemini and custom Python data mining models. Performs automated technical indicators sweeps, news mood evaluation, and executes simulated trades.",
    category: "Web",
    tags: ["React 19", "Python", "FastAPI", "Redis", "Docker", "AWS", "Gemini API"],
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=600&q=80",
    github: "https://github.com/andrianus-maria/quant-iq",
    demo: "https://quant.andrianus.web.id",
    metrics: {
      performance: "99%",
      seo: "98%",
      accessibility: "100%",
      lighthouse: "99"
    },
    caseStudy: {
      challenge: "Handling concurrent real-time websockets price feeds and matching orders under 10ms processing windows.",
      solution: "Created an in-memory high-speed cache layer with Redis Enterprise and streamlined FastAPI event queues for direct execution of algorithmic indicators.",
      impact: "Achieved sub-5ms trade recommendation generations and scaled up to 10,000 requests per second under peak testing loads."
    }
  },
  {
    id: "chronos-flow",
    title: "Chronos Flow Orchestrator",
    description: "Lightweight, developer-centric DevOps platform enabling rapid continuous integration and automated Kubernetes pod deployments. Outfitted with real-time terminal progress logging.",
    category: "DevOps",
    tags: ["Go", "Laravel 12", "Kubernetes", "Docker", "S3 Compatible", "GitHub API"],
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
    github: "https://github.com/andrianus-maria/chronos-flow",
    demo: "https://chronos.andrianus.web.id",
    metrics: {
      performance: "97%",
      seo: "95%",
      accessibility: "95%",
      lighthouse: "96"
    },
    caseStudy: {
      challenge: "Simplifying Kubernetes deployment setups for front-end developers without compromising secure access keys or enterprise credentials.",
      solution: "Engineered a custom Laravel visual wrapper orchestrating native Helm commands and encapsulating environment structures safely in AWS vault storage.",
      impact: "Reduced container pipeline onboarding times from 2 days to under 4 minutes with fully auditable user deploy permissions."
    }
  },
  {
    id: "aether-cms",
    title: "Aether CMS Platform",
    description: "Next-generation headless content management platform sporting ultra-fast GraphQL endpoints, multiple visual builder schemes, and auto-distributed edge caching algorithms.",
    category: "Backend",
    tags: ["Laravel 12+", "GraphQL", "Next.js", "MongoDB", "Redis", "Cloudflare R2"],
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    github: "https://github.com/andrianus-maria/aether-cms",
    demo: "https://aether.andrianus.web.id",
    metrics: {
      performance: "96%",
      seo: "100%",
      accessibility: "98%",
      lighthouse: "98"
    },
    caseStudy: {
      challenge: "Database search slowdowns when executing deeply nested schema queries over 10M+ content articles.",
      solution: "Restructured MongoDB indexing matrices and built dynamic cache invalidation hooks inside Laravel linking directly to a fast Redis memory grid.",
      impact: "Cut database response metrics by 75% while scaling live article deliveries under intense parallel global user loads."
    }
  }
];

export const BLOGS_DATA: BlogPost[] = [
  {
    id: "microservices-patterns",
    title: "Mastering Microservices: Decoupling with Kafka and Node.js Workers",
    description: "A deep dive into building event-driven microservices architectures. Explore the benefits of Kafka messaging over standard synchronous REST APIs and how to build resilient workers.",
    content: `## The Monolith Bottleneck
As full-stack web architectures grow, they inevitably encounter horizontal scaling limitations. Modern frameworks like Laravel and Express offer magnificent utility packages, but running intense background processing synchronically inside the request cycle degrades user experience quickly.

### Enter Event-Driven Decoupling
By inserting a distributed event streaming platform like **Apache Kafka** between your client facing services and background computation layers, we establish a bulletproof asynchronous pipeline:

1. **Producer (Laravel API):** Captures high-priority client requests, writes a lightweight event schema to Kafka, and instantly returns a '202 Accepted' response.
2. **Kafka Clusters:** Act as durable, sequential, and partitionable buffers to withstand traffic peaks.
3. **Consumer (Node.js/TypeScript Workers):** Polls Kafka topics in parallel, performing computations, emails, database logs, and alerting websockets when ready.

\`\`\`typescript
// Express / Node.js Kafka Consumer Example
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'analytics-worker',
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });

async function start() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-clicks', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const data = JSON.parse(message.value?.toString() || '{}');
      // Perform database indexing or ETL
      await processMetrics(data);
    }
  });
}
\`\`\``,
    tags: ["Microservices", "Kafka", "Node.js", "Backend"],
    category: "Backend",
    readingTime: "6 min read",
    date: "June 25, 2026",
    likes: 42,
    comments: [
      { id: "c1", author: "Sarah Connor", text: "This approach completely resolved our webhook timeout bugs. Great read!", date: "June 26, 2026" }
    ]
  },
  {
    id: "laravel-redis-caching",
    title: "Laravel 12 Performance Boost: Advanced Redis Cache Patterns",
    description: "Unlock extreme speed in your Laravel applications. We cover custom tags serialization, atomic locks, dynamic invalidations, and pre-loading cache strategies.",
    content: `## Redis Beyond Simple Key-Value
Redis is widely popular as a basic cache store, but its true power shines when utilized for advanced in-memory structures like atomic locking, rate limiters, and real-time sorted leaders.

### Advanced Serialized Cache Tags
When hosting high-density portals, flushing the whole cache is highly inefficient. Cache Tags allow you to group related records together and flush only specific nodes.

\`\`\`php
// Laravel 12 Custom Caching with Tags
use Illuminate\\Support\\Facades\\Cache;

$products = Cache::tags(['products', 'catalog'])->remember('page_1', 3600, function () {
    return Product::where('active', true)->paginate(15);
});

// Invalidating ONLY the products catalog
Cache::tags('products')->flush();
\`\`\`

### Caching with Atomic Locks
Avoid race conditions and duplicate operations by securing tasks behind atomic Redis locks:

\`\`\`php
$lock = Cache::lock('process-payout-123', 10);

if ($lock->get()) {
    // Perform secure operations
    $lock->release();
}
\`\`\``,
    tags: ["Laravel", "Redis", "Database", "Performance"],
    category: "Backend",
    readingTime: "4 min read",
    date: "June 18, 2026",
    likes: 35,
    comments: []
  },
  {
    id: "devops-kubernetes-setup",
    title: "Kubernetes CKA Guide: Architecting Zero-Downtime Deployments",
    description: "How to properly configure rolling updates, readiness and liveness probes, and resource constraints on Kubernetes clusters to achieve 99.99% system availability.",
    content: `## Achieving True High Availability
Modern container orchestration is not just about spin-ups, but managing smooth state adjustments without denying service to your users.

### The Rolling Update Strategy
To replace pods incrementally, define a strict \`rollingUpdate\` strategy inside your deployment manifest:

\`\`\`yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
\`\`\`

- **maxSurge:** Specifies the number of excess pods K8s can launch during updates.
- **maxUnavailable:** Ensures all current replica metrics stay available during transition.

### Readiness & Liveness Probes
These probes are critical to prevent K8s from routing traffic to broken containers:

- **Liveness:** Restarts container if it crashes.
- **Readiness:** Delays traffic until the container successfully boots databases and cache lines.`,
    tags: ["Kubernetes", "DevOps", "Docker", "AWS"],
    category: "DevOps",
    readingTime: "8 min read",
    date: "June 10, 2026",
    likes: 56,
    comments: []
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: "g1",
    url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    title: "Architectural Mapping",
    description: "Visualizing deeply connected event-driven microservices structures, APIs, and Redis database connections.",
    category: "Architecture",
    size: "medium"
  },
  {
    id: "g2",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    title: "Sleek Workspace",
    description: "The developer setup in Jakarta, Indonesia — dual high-density monitors, custom mechanical terminal keyboards.",
    category: "Office",
    size: "large"
  },
  {
    id: "g3",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    title: "Cloud Infrastructure",
    description: "Conceptual mapping of AWS distributed clusters and multi-zone failovers.",
    category: "Cloud",
    size: "small"
  },
  {
    id: "g4",
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80",
    title: "Kubernetes Cluster Board",
    description: "Inspecting live logs and cluster scaling metrics inside the main developer console.",
    category: "DevOps",
    size: "medium"
  }
];

export const TIMELINE_DATA: TimelineItem[] = [
  {
    id: "exp-1",
    type: "experience",
    title: "Lead Full-Stack Engineer",
    organization: "IDSTAR Group",
    period: "2023 - Present",
    description: "Head full-stack architectures and lead 8 software engineers developing enterprise ERP, messaging hubs, and real-time telemetry systems.",
    highlights: [
      "Migrated monolithic systems to event-driven microservices using NestJS and Kafka, increasing processing speeds by 45%.",
      "Successfully scaled server cluster metrics supporting 2M+ active daily requests.",
      "Integrated secure caching arrays with Redis and automated Kubernetes cluster deploys on AWS."
    ],
    logo: "bg-blue-600/20 text-blue-400 border-blue-500/30"
  },
  {
    id: "exp-2",
    type: "experience",
    title: "Senior Software Engineer",
    organization: "TechCorp Indonesia",
    period: "2020 - 2023",
    description: "Designed core backends and high-performance APIs using Laravel, PHP 8, and Vue.js. Coordinated developer sprints.",
    highlights: [
      "Reduced database query bottlenecks by 40% using specialized indexing and query memoization.",
      "Engineered automated GitHub Actions CI/CD workflows, slashing manual deployment tasks to 0.",
      "Co-managed AWS ECS/EKS container architectures holding e-commerce sales nodes."
    ],
    logo: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30"
  },
  {
    id: "edu-1",
    type: "education",
    title: "Bachelor of Computer Science",
    organization: "Universitas Indonesia",
    period: "2014 - 2018",
    description: "Excelled in distributed networks, databases, parallel computing, and clean software engineering. Graduated with Honors.",
    highlights: [
      "Thesis: Scaling Event Brokers in Low-Bandwidth Networks.",
      "Active Organizer of UI Hacker Hackathons and Coding circles."
    ],
    logo: "bg-purple-600/20 text-purple-400 border-purple-500/30"
  }
];

export const MISSIONS_DATA: Mission[] = [
  { id: "explore-hero", title: "Cyber Scanner Init", description: "Scan the interactive holographic hero screen and activate visual shields.", xpReward: 100, status: "active" },
  { id: "read-blog", title: "Information Sync", description: "Absorb deep technological knowledge by reading a full architectural blog.", xpReward: 150, status: "locked" },
  { id: "play-game", title: "Fun Zone Activation", description: "Boot up and play any gamified coding mini-game to test developer parameters.", xpReward: 200, status: "locked" },
  { id: "ask-ai", title: "Cognitive Handshake", description: "Initiate contact with the server-side Gemini AI Chat Assistant.", xpReward: 150, status: "locked" },
  { id: "treasure-hunt", title: "Treasure Hunt: Hidden Bug", description: "Find the hidden easter egg bug located in the secret cracks of the console.", xpReward: 300, status: "locked" }
];

export const ACHIEVEMENTS_DATA: Achievement[] = [
  { id: "ach-init", title: "Hello World", description: "Initiate your developer profile in the futuristic matrix.", xpReward: 50, category: "exploration" },
  { id: "ach-ai-chat", title: "AI Sync", description: "Complete a cognitive briefing with the AI Chat Assistant.", xpReward: 100, badgeId: "badge-ai-sync", category: "ai" },
  { id: "ach-high-score", title: "Neon Master", description: "Score over 150 points in the Snake AI mini-game.", xpReward: 250, badgeId: "badge-neon-master", category: "mini-games" },
  { id: "ach-bug-hunter", title: "Zero Bug Bounty", description: "Solve a Bug Hunter logic script without using clues.", xpReward: 200, badgeId: "badge-hunter", category: "mini-games" },
  { id: "ach-all-complete", title: "Grand Architect", description: "Complete all developer missions and unlock full credentials.", xpReward: 500, badgeId: "badge-grand", category: "exploration" }
];

// MOCK TRIVIA QUESTIONS
export const TRIVIA_QUESTIONS = [
  {
    q: "Which protocol is primarily used by Kafka for message delivery and communication?",
    options: ["HTTP/2", "TCP Custom Protocol", "gRPC", "MQTT"],
    answer: "TCP Custom Protocol"
  },
  {
    q: "What is the primary difference between a Kubernetes Liveness probe and Readiness probe?",
    options: [
      "Liveness controls container scaling, Readiness controls nodes",
      "Liveness restarts crashed containers, Readiness routes user traffic when ready",
      "Liveness checks database schemas, Readiness checks CPU levels",
      "There is no difference"
    ],
    answer: "Liveness restarts crashed containers, Readiness routes user traffic when ready"
  },
  {
    q: "Which caching eviction policy removes the least recently accessed items first?",
    options: ["FIFO", "LRU", "LFU", "TTL"],
    answer: "LRU"
  }
];

// MOCK BUG HUNTER CODES
export const BUG_HUNTER_QUESTIONS = [
  {
    id: "bug-1",
    language: "JavaScript / React",
    code: `import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // BUG HERE: Setting state in effect without dependency causes crash
    setCount(count + 1);
  }, [count]);

  return <div>{count}</div>;
}`,
    bugLine: 8,
    explanation: "Updating 'count' within an effect that depends on 'count' creates an infinite rendering loop, causing browser tab crashes.",
    options: [
      "Line 1: Incorrect imports",
      "Line 4: Incorrect hook declaration",
      "Line 8: State change triggers infinite re-renders",
      "Line 11: Missing return brackets"
    ],
    answerIndex: 2
  },
  {
    id: "bug-2",
    language: "PHP / Laravel",
    code: `namespace App\\Http\\Controllers;
use App\\Models\\User;

class UserController extends Controller {
    public function show($id) {
        // BUG HERE: SQL Injection vulnerability
        $user = User::whereRaw("id = " . $id)->first();
        return response()->json($user);
    }
}`,
    bugLine: 7,
    explanation: "Using string concatenation inside 'whereRaw' bypasses Eloquent parameter sanitization, leading to critical SQL Injection vulnerabilities.",
    options: [
      "Line 1: Incorrect namespace definition",
      "Line 5: Incompatible method argument type",
      "Line 7: Raw string concatenation causes SQL Injection",
      "Line 8: Missing return statement"
    ],
    answerIndex: 2
  }
];

// MOCK CODE PUZZLES
export const CODE_PUZZLE_QUESTIONS = [
  {
    id: "puzzle-1",
    title: "Configure Laravel Redis Cache Endpoint",
    lines: [
      "use Illuminate\\Support\\Facades\\Cache;",
      "$data = Cache::tags(['api', 'users'])",
      "    ->remember('user_profile_12', 3600, function () {",
      "        return User::with('roles')->find(12);",
      "    });"
    ],
    hints: ["Always import the Cache facade first.", "Invoke the tags method next.", "Utilize the remember parameter closure to load users."]
  }
];

// MOCK GUESS LANGUAGE SNIPPETS
export const GUESS_LANG_QUESTIONS = [
  {
    id: "guess-1",
    code: `fn main() {
    let mut vec = Vec::new();
    vec.push(1);
    vec.push(2);
    println!("Vector: {:?}", vec);
}`,
    options: ["C++", "Rust", "Go", "Swift"],
    answer: "Rust"
  },
  {
    id: "guess-2",
    code: `package main
import "fmt"

func main() {
    ch := make(chan string)
    go func() { ch <- "ping" }()
    fmt.Println(<-ch)
}`,
    options: ["Go", "C++", "Python", "Rust"],
    answer: "Go"
  }
];
