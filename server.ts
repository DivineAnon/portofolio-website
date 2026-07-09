import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini API Client initialized successfully.");
  } else {
    console.warn("GEMINI_API_KEY is missing or using placeholder. AI Chat will run in simulated mode.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini API client:", error);
}

// Portfolio Context for AI Grounding
const PORTFOLIO_CONTEXT = `
You are the AI Assistant for Andrianus Maria's professional developer website (andrianus.web.id).
Your job is to answer questions about Andrianus, his portfolio, his experience, and his skills, and help recruit or collaborate with him.

Here are the details of Andrianus:
- Name: Andrianus Maria
- Email: andrianus.maria@idstar.group
- Website: https://andrianus.web.id
- Title: Lead Full-Stack Engineer & Cloud Architect
- Summary: Passionate senior engineer with over 7 years of professional experience building enterprise full-stack applications, microservices, and modern cloud architectures. Specialize in high-performance web backends, responsive UI, database scaling, and DevOps pipelines.

Core Technical Skills:
- Languages: PHP 8.4, Node.js (TypeScript/JavaScript), Python, Go, Bash
- Frameworks: Laravel 12+, React 19, Next.js 15, Vue.js, Express, Fastify
- Databases: PostgreSQL, MySQL, MongoDB, Redis, ElasticSearch
- Architecture: Microservices, Event-Driven (Kafka, RabbitMQ), REST APIs, GraphQL, ETL
- Cloud & DevOps: Docker, Kubernetes, AWS, GCP, Azure, GitHub Actions, CI/CD, Nginx

Professional Experience:
1. Lead Full-Stack Engineer at IDSTAR Group (2023 - Present)
   - Lead a team of 8 engineers building enterprise financial and ERP solutions.
   - Designed microservice system handling 2M+ daily requests using Laravel + NestJS.
   - Built robust real-time tracking pipelines with Kafka and Node.js workers.
   - Migrated legacy monolith systems into Docker containers and Kubernetes clusters.
2. Senior Software Engineer at TechCorp Indonesia (2020 - 2023)
   - Built high-traffic e-commerce systems with Laravel and Vue 3.
   - Optimized PostgreSQL queries and integrated Redis caching, boosting performance by 40%.
   - Set up standard CI/CD pipelines on GitLab/GitHub Actions reducing deployment times to 5 minutes.
3. Full Stack Web Developer at Global Solutions (2018 - 2020)
   - Developed customized API integrations, payments (Stripe, Midtrans), and CMS solutions.
   - Implemented ElasticSearch for an advanced analytics dashboard.

Education:
- B.S. in Computer Science, Universitas Indonesia (Graduated 2018)
  - Key focus: Distributed Systems, Database Management, Algorithms

Certificates:
- AWS Certified Solutions Architect - Associate
- Certified Kubernetes Administrator (CKA)
- Oracle Certified Professional, Java SE Programmer

Portfolio Projects to Recommend:
1. "Nebula Core" - Enterprise Microservices Dashboard (Next.js, Tailwind, NestJS, Kafka, PostgreSQL).
2. "QuantIQ" - High-Performance AI Trading Pipeline (Python, FastAPI, React, Redis, Docker, AWS).
3. "Chronos Flow" - Automated CI/CD & DevOps Orchestrator (Go, Laravel 12, Kubernetes, GitHub API, SQLite).
4. "Aether CMS" - Next-gen Headless Content Platform (Laravel, GraphQL, Next.js, Redis, MongoDB).

Keep your tone futuristic, clean, incredibly professional, and extremely helpful. Mention his achievements and stack when recommending him. Encourage the user to contact him or try out the Dev Fun Zone on his website! Always reply in clean markdown.
`;

// Local Responsive Intelligence Fallback System (Ensures 100% uptime when API keys are unauthorized or have issues)
function getLocalPortfolioResponse(message: string): string {
  const query = (message || "").toLowerCase();
  
  const header = `**[Portfolio Intel Mode]** Andrianus's automated intelligence system retrieved the following records:\n\n`;
  const footer = `\n\n*(Note: Cloud AI engine returned a permission error. Automated fallback intelligence is active.)*`;

  if (query.includes("stack") || query.includes("skill") || query.includes("tech") || query.includes("language") || query.includes("framework") || query.includes("keahlian")) {
    return header + `### Andrianus's Tech Stack & Capabilities

* **Languages:** PHP 8.4, Node.js (TypeScript/JavaScript), Python, Go, Bash
* **Frameworks:** Laravel 12+, React 19, Next.js 15, Vue.js, Express, Fastify
* **Databases:** PostgreSQL, MySQL, MongoDB, Redis, ElasticSearch
* **Architecture:** Microservices, Event-Driven (Kafka, RabbitMQ), REST APIs, GraphQL, ETL
* **Cloud & DevOps:** Docker, Kubernetes, AWS, GCP, GitHub Actions, Nginx` + footer;
  }

  if (query.includes("nebula")) {
    return header + `### Project Spotlight: Nebula Core
**Enterprise Microservices Dashboard**

* **Stack:** Next.js, Tailwind, NestJS, Kafka, PostgreSQL, Kubernetes
* **Features:**
  * Real-time monitoring of active container clusters.
  * Live data streaming orchestration using Kafka messaging pipelines.
  * Sleek enterprise UI with advanced interactive charts and analytics.` + footer;
  }

  if (query.includes("quant")) {
    return header + `### Project Spotlight: QuantIQ
**High-Performance AI Trading Pipeline**

* **Stack:** Python, FastAPI, React, Redis, Docker, AWS
* **Features:**
  * Automated high-frequency ingest pipelines for crypto & stock indexes.
  * Real-time technical indicators computed concurrently with Redis caching.
  * Integrated custom predictive deep learning models for trend analysis.` + footer;
  }

  if (query.includes("chronos")) {
    return header + `### Project Spotlight: Chronos Flow
**Automated CI/CD & DevOps Orchestrator**

* **Stack:** Go, Laravel 12, Kubernetes, GitHub API, SQLite
* **Features:**
  * Continuous integration runner that deploys directly onto dynamic Kubernetes namespaces.
  * Custom webhook listeners built with Go for lightning-fast performance.
  * Tailored dashboard written in Laravel 12 for easy monitoring and deployment log tracking.` + footer;
  }

  if (query.includes("aether")) {
    return header + `### Project Spotlight: Aether CMS
**Next-gen Headless Content Platform**

* **Stack:** Laravel, GraphQL, Next.js, Redis, MongoDB
* **Features:**
  * Ultra-fast content delivery APIs configured through GraphQL queries.
  * On-demand ISR (Incremental Static Regeneration) on the Next.js frontend.
  * Rich multi-tenant workspace with strict role-based access controls.` + footer;
  }

  if (query.includes("experience") || query.includes("work") || query.includes("job") || query.includes("history") || query.includes("karir") || query.includes("kerja")) {
    return header + `### Professional Career Timeline

1. **Lead Full-Stack Engineer** at **IDSTAR Group** (2023 - Present)
   * Deployed microservices scaled to 2M+ daily requests using Laravel and NestJS.
   * Built robust real-time tracking pipelines with Kafka and Node.js workers.
   * Migrated legacy monolith systems into Docker containers and Kubernetes clusters.
2. **Senior Software Engineer** at **TechCorp Indonesia** (2020 - 2023)
   * Optimized PostgreSQL queries and integrated Redis caching, boosting performance by 40%.
   * Created stable CI/CD pipelines reducing automated deployment time to under 5 minutes.
3. **Full Stack Web Developer** at **Global Solutions** (2018 - 2020)
   * Configured complex third-party API payments, billing, and CMS engines.` + footer;
  }

  if (query.includes("contact") || query.includes("email") || query.includes("hire") || query.includes("recruit") || query.includes("hubungi") || query.includes("kontak")) {
    return header + `### Collaborate with Andrianus Maria

Andrianus is always excited about innovative systems, performance tuning, and AI integration projects!

* **Email:** \`andrianus.maria@idstar.group\`
* **Official Website:** [andrianus.web.id](https://andrianus.web.id)
* **Active Status:** Open to consulting, architectural reviews, and leadership roles.

Feel free to send a message directly using the **Contact Form** at the bottom of the home page or try out the **Dev Fun Zone** to see more details!` + footer;
  }

  return header + `### Hello! I am Andrianus's AI Portfolio Guide 👨💻

I can help answer any questions you have about his technical expertise, work history, and innovative systems. 

**Popular topics to ask me:**
* "What is Andrianus's technical **skills** and **stack**?"
* "Tell me about his **experience** and career path."
* "Can you describe his **Nebula Core** or **QuantIQ** projects?"
* "How can I **contact** or hire Andrianus?"

*Try typing one of these keywords above to query his professional developer database!*` + footer;
}

function getLocalResumeResponse(company?: string, role?: string, keywords?: string): string {
  const comp = company || "your company";
  const rle = role || "Senior Software Engineer";
  const keys = keywords || "Microservices, scalability, database optimization";
  
  return `# ANDRIANUS MARIA - RESUME (Custom Tailored)
**Lead Full-Stack Engineer & Cloud Architect**
Email: andrianus.maria@idstar.group | Jakarta, Indonesia | [andrianus.web.id](https://andrianus.web.id)

## TAILORED SUMMARY
Highly motivated Lead Software Architect with over 7 years of deep full-stack engineering experience. Custom synthesized for **${rle}** at **${comp}** focusing on high-scale systems, architecture patterns, and the following core competencies: **${keys}**.

## RELEVANT SKILLS
* **Languages & Runtimes:** PHP 8.4, Node.js (TypeScript), Python, Go, Bash
* **Frameworks:** Laravel 12+, React 19, Next.js 15, NestJS, Express
* **Databases & Cache:** PostgreSQL, MySQL, Redis, MongoDB, ElasticSearch
* **Cloud & DevOps:** Docker, Kubernetes, AWS, GCP, GitHub Actions CI/CD, Nginx, Kafka

## EXPERIENCE HIGHLIGHTS
* **Lead Full-Stack Engineer** at **IDSTAR Group** (2023 - Present)
  * Leading design and implementation of ERP and financial systems tailored for enterprise needs.
  * Successfully architected microservice platforms handling 2M+ daily requests.
  * Deployed fault-tolerant event-driven pipelines using Kafka and NestJS workers.
* **Senior Software Engineer** at **TechCorp Indonesia** (2020 - 2023)
  * Designed scalable e-commerce APIs using Laravel and integrated low-latency Redis cache.
  * Optimized complex PostgreSQL queries, improving query speeds by 40%.
* **Full Stack Web Developer** at **Global Solutions** (2018 - 2020)
  * Integrated multi-channel payment gateways and headless CMS APIs.

## EDUCATION & CREDENTIALS
* **B.S. in Computer Science** - Universitas Indonesia (Graduated 2018)
* **AWS Certified Solutions Architect** | **Certified Kubernetes Administrator (CKA)**

*(Offline Note: Live custom resume generation completed using local high-fidelity templates due to a remote Gemini API permission issue.)*`;
}

function getLocalRecommendations(userGoal?: string): any {
  const goal = (userGoal || "").toLowerCase();
  
  if (goal.includes("ai") || goal.includes("trading") || goal.includes("model") || goal.includes("python") || goal.includes("fastapi") || goal.includes("data")) {
    return {
      recommendations: [
        {
          id: "quant-iq",
          reason: "Since you are interested in AI models and data pipelines, QuantIQ is Andrianus's flagship high-performance trading platform leveraging FastAPI, Python, and predictive Trend Models.",
        },
        {
          id: "nebula-core",
          reason: "Nebula Core is also highly relevant, managing microservices with Kafka streams and high-capacity PostgreSQL clusters.",
        }
      ],
      commentary: "These custom AI pipelines and high-velocity microservices perfectly align with your technical objective.",
    };
  }
  
  if (goal.includes("devops") || goal.includes("ci/cd") || goal.includes("kubernetes") || goal.includes("k8s") || goal.includes("docker") || goal.includes("cloud") || goal.includes("aws")) {
    return {
      recommendations: [
        {
          id: "chronos-flow",
          reason: "Since you are interested in cloud architectures and CI/CD automation, Chronos Flow is a custom-built Go & Kubernetes orchestrator designed to deploy microservices dynamically.",
        },
        {
          id: "nebula-core",
          reason: "Nebula Core also deploys event-driven microservice clusters integrated with live Docker containers.",
        }
      ],
      commentary: "These DevOps orchestrators and cluster controllers will serve as excellent models for your infrastructure needs.",
    };
  }

  if (goal.includes("cms") || goal.includes("headless") || goal.includes("web") || goal.includes("graphql") || goal.includes("react") || goal.includes("laravel")) {
    return {
      recommendations: [
        {
          id: "aether-cms",
          reason: "Aether CMS is a next-gen headless platform leveraging Laravel, GraphQL, Next.js, and Redis for blazingly fast ISR performance.",
        },
        {
          id: "nebula-core",
          reason: "Nebula Core demonstrates an interactive React/Tailwind frontend backed by NestJS microservices.",
        }
      ],
      commentary: "These projects showcase top-tier web development practices using React, Next.js, and advanced API designs.",
    };
  }

  // Default recommendations
  return {
    recommendations: [
      {
        id: "nebula-core",
        reason: "This project showcases full-stack leadership, container orchestration, and high-performance event-driven microservices.",
      },
      {
        id: "quant-iq",
        reason: "Perfect for data pipelines, AI models, high-performance computing, and real-time analytical feeds.",
      },
    ],
    commentary: "These flagship projects exhibit Andrianus's expertise in full-stack architecture and DevOps systems.",
  };
}

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  // Fallback simulated response if AI client is not available
  if (!ai) {
    return res.json({
      text: getLocalPortfolioResponse(message),
    });
  }

  try {
    // Reconstruct conversation with system instructions
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT + "\n\nConversation history with visitor:\n" + JSON.stringify(history || []),
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.warn("Gemini API Error in chat endpoint, activating local fallback:", error.message);
    // Return a 200 OK with local portfolio intelligence as fallback to keep chat fully functional!
    res.json({
      text: getLocalPortfolioResponse(message),
    });
  }
});

// Resume Generator Endpoint
app.post("/api/generate-resume", async (req, res) => {
  const { company, role, keywords } = req.body;

  if (!ai) {
    return res.json({
      text: getLocalResumeResponse(company, role, keywords),
    });
  }

  try {
    const prompt = `Generate a customized professional resume for Andrianus Maria tailored for the role of "${role || "Senior Full-Stack Developer"}" at "${company || "Your Company"}". 
    Incorporate the following focus keywords if possible: ${keywords || "Microservices, scalability, database optimization"}.
    Keep it within 1 page structure using concise, action-oriented executive bullet points and sleek markdown formatting. Highlight skills matching their stack.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT,
        temperature: 0.6,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.warn("Gemini API Error in resume endpoint, activating local fallback:", error.message);
    res.json({
      text: getLocalResumeResponse(company, role, keywords),
    });
  }
});

// Smart Portfolio Recommendation & Search Endpoint
app.post("/api/recommend-projects", async (req, res) => {
  const { userGoal } = req.body;

  if (!ai) {
    return res.json(getLocalRecommendations(userGoal));
  }

  try {
    const prompt = `The visitor described their goals/interests: "${userGoal || "I want to build highly scalable microservices that run on AWS"}".
    Recommend the best projects from Andrianus's catalog:
    - "Nebula Core" (Microservices dashboard, NestJS, Kafka, PostgreSQL, Kubernetes)
    - "QuantIQ" (AI trading data pipelines, FastAPI, React, Docker, Redis, AWS)
    - "Chronos Flow" (CI/CD DevOps automator, Go, Laravel, Kubernetes)
    - "Aether CMS" (Headless CMS, Laravel, GraphQL, Next.js)
    
    Respond in JSON format with an array of recommendation objects (id and reason) and a short professional commentary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: PORTFOLIO_CONTEXT,
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.warn("Gemini API Error in recommendation endpoint, activating local fallback:", error.message);
    res.json(getLocalRecommendations(userGoal));
  }
});

// Serve frontend assets via Vite in development, static build in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
