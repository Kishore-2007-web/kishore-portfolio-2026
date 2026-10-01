/**
 * Single Source of Truth Knowledge Base for Kishore
 * Structured portfolio intelligence for the Local AI Assistant.
 * Grounded strictly in verified portfolio data — no hallucinations.
 */

import { siteConfig } from '../data/site';
import { featuredProjects, secondaryProjects, archiveProjects } from '../data/projects';
import { labItems } from '../data/lab';
import { WHATSAPP_CONFIG } from '../utils/whatsapp';

export const kishoreKnowledge = {
  profile: {
    name: "Kishore",
    fullName: "Kishore V",
    titles: [
      "Web Developer",
      "UI/UX Designer",
      "Software Developer",
      "Game Developer",
      "3D Creator"
    ],
    tagline: "I BUILD DIGITAL EXPERIENCES THAT MATTER.",
    philosophy: "PURPOSE OVER FANCY. Technology is a tool to create real impact and be genuinely useful to people rather than building something simply because it looks fancy.",
    bio: "Kishore is a Computer Science student and creative developer who builds across web development, software, AI experiments, game development, and 3D interactive experiences. He enjoys experimenting with new technologies and turning ideas into working, useful software.",
    location: "India",
    portfolioUrl: "https://kishore-portfolio.vercel.app",
    aboutCopy: siteConfig.aboutCopy,
  },

  education: {
    status: "Undergraduate Computer Science Student",
    degree: "Computer Science and Engineering (CSE)",
    focusAreas: [
      "Web Technologies and Systems Architecture",
      "Software Engineering & Object-Oriented Programming",
      "Artificial Intelligence & Machine Learning Fundamentals",
      "3D Graphics & Game Engine Mechanics",
      "Cybersecurity Fundamentals"
    ],
    academicHighlights: "Focused on hands-on practical implementation, experimenting across modern full-stack development, cyber defense prototypes, and game engines."
  },

  skills: {
    frontend: [
      { name: "HTML5", level: "Advanced", description: "Semantic markup, accessibility, modern web standards" },
      { name: "CSS3 / Vanilla CSS", level: "Advanced", description: "Glassmorphism, custom design systems, responsive layouts, CSS variables, animations" },
      { name: "JavaScript (ES6+)", level: "Advanced", description: "Modern asynchronous JS, DOM manipulation, functional architecture, Web APIs" },
      { name: "React", level: "Proficient", description: "Component architecture, hooks, state management, SPA routing, performance optimization" },
      { name: "Three.js / WebGL / OGL", level: "Working Knowledge", description: "Interactive 3D scenes, shaders, volumetric rays, particle systems, canvas rendering" }
    ],
    backendAndCloud: [
      { name: "Node.js", level: "Intermediate", description: "Server-side logic, API integrations, build tools" },
      { name: "REST APIs", level: "Proficient", description: "API design, third-party service integration, async data flow" },
      { name: "Firebase", level: "Intermediate", description: "Authentication, Firestore real-time database, cloud hosting" },
      { name: "MongoDB", level: "Intermediate", description: "NoSQL schema design, database querying" },
      { name: "LocalStorage API", level: "Proficient", description: "Client-side offline persistence and state synchronization" }
    ],
    gameDevAnd3D: [
      { name: "Unreal Engine", level: "Working Knowledge", description: "Game mechanics, lighting, audio design, psychological horror environments (e.g. The Room)" },
      { name: "Unity", level: "Working Knowledge", description: "2D/3D game development and interactive scenes" },
      { name: "Blender", level: "Working Knowledge", description: "3D modeling, asset creation, texturing, rendering" },
      { name: "Maya", level: "Working Knowledge", description: "3D modeling and animation pipelines" }
    ],
    toolsAndWorkflow: [
      { name: "Git & GitHub", level: "Advanced", description: "Version control, open-source collaboration, automated workflows, building in public" },
      { name: "VS Code", level: "Advanced", description: "Primary IDE, extensions, development environment configuration" },
      { name: "Figma", level: "Proficient", description: "UI/UX wireframing, high-fidelity prototypes, editorial layout design (FOSSAGE 26)" },
      { name: "Antigravity", level: "Proficient", description: "Advanced AI-assisted pair programming and development workflows" },
      { name: "Canva", level: "Proficient", description: "Visual assets, graphics design" }
    ],
    languages: [
      { name: "JavaScript", description: "Primary programming language for web and applications" },
      { name: "Python Basics", description: "Scripting, automation, AI experimentation" },
      { name: "C++ Basics", description: "Game programming in Unreal Engine" }
    ],
    softSkills: [
      "Problem Solving",
      "Clear Technical Communication",
      "Collaborative Teamwork",
      "Creative & Cinematic Design Thinking",
      "Adaptability to Emerging Tech Stacks"
    ]
  },

  projects: [
    {
      id: "kisa-ai",
      title: "Kisa AI",
      category: "AI Chatbot & Conversational Intelligence",
      description: "Personal AI chatbot and conversational intelligence assistant engineered for fast, context-aware query resolution and intelligent user interaction.",
      technologies: ["React", "API Integration", "Node.js", "CSS Modules"],
      status: "LIVE",
      github: "https://github.com/Kishore-2007-web/AI-CHATBOT",
      live: "https://kisa-ai.vercel.app",
      highlight: "Explores interactive AI query handling and conversational UX."
    },
    {
      id: "usbshield",
      title: "USBShield",
      category: "Cybersecurity Prototype",
      description: "A lightweight USB safety scanner and cybersecurity prototype that checks connected USB drives and determines potential safety based on file presence, anomalous structures, and file integrity.",
      technologies: ["Cybersecurity", "Scripting", "USB Analysis", "Security Prototype"],
      status: "EXPERIMENT / PROTOTYPE",
      github: "https://github.com/Kishore-2007-web",
      live: null,
      highlight: "Lightweight hardware/software security experiment for automated USB threat analysis."
    },
    {
      id: "reposhield-ai",
      title: "RepoShield AI",
      category: "AI × Cybersecurity",
      description: "An AI-powered security scanner experiment focused on inspecting code repositories to identify potential vulnerabilities, credential leaks, and architectural risks.",
      technologies: ["AI", "Cybersecurity", "Code Analysis", "Automation"],
      status: "EXPERIMENT",
      github: "https://github.com/Kishore-2007-web",
      live: null,
      highlight: "Merges artificial intelligence with static security code analysis."
    },
    {
      id: "calculatorhub",
      title: "CalculatorHub",
      category: "Large-Scale Computational Platform",
      description: "A comprehensive web-based computational utility featuring over 300 specialized calculators across finance, engineering, mathematics, physics, and daily calculation needs.",
      technologies: ["JavaScript", "HTML5", "CSS3", "Vercel"],
      status: "LIVE",
      github: "https://github.com/Kishore-2007-web/calculatorhub",
      live: "https://calculatorhub-gold.vercel.app/",
      highlight: "Over 300 specialized computational engines packed into a clean, responsive web interface."
    },
    {
      id: "the-room",
      title: "The Room",
      category: "Unreal Engine Horror Game",
      description: "A single-player first-person psychological horror game built in Unreal Engine featuring atmospheric lighting, spatial 3D audio design, and tension-driven puzzle mechanics.",
      technologies: ["Unreal Engine", "C++", "3D Modeling", "Audio Design"],
      status: "PRIVATE REPOSITORY",
      github: null,
      live: null,
      highlight: "Psychological atmosphere driven by custom lighting and immersive 3D mechanics."
    },
    {
      id: "rise-of-aran",
      title: "Rise of Aran",
      category: "Game Dev × Tamil Heritage",
      description: "A Tamil-heritage-inspired 3D action game experiment combining cultural storytelling, interactive 3D environments, historical aesthetic art, and combat mechanics.",
      technologies: ["Game Design", "3D Environments", "Storytelling", "Cultural Art"],
      status: "PROTOTYPE",
      github: "https://github.com/Kishore-2007-web",
      live: null,
      highlight: "Explores cultural storytelling and regional heritage through interactive 3D gameplay."
    },
    {
      id: "my-pocket-tracker",
      title: "My Pocket Tracker",
      category: "Personal Finance Management",
      description: "A unified personal and business finance tracking application for recording daily expenses, tracking budget limits, and visualizing revenue flows.",
      technologies: ["React", "JavaScript", "LocalStorage API", "Chart Visualization"],
      status: "LIVE",
      github: "https://github.com/Kishore-2007-web/expence_tracker",
      live: "https://my-pocket-tracker.vercel.app",
      highlight: "Clean client-side persistence and visual financial charts."
    },
    {
      id: "auto-git-pusher",
      title: "Auto Git Pusher",
      category: "Developer Productivity Utility",
      description: "An automation utility designed to streamline repetitive Git and GitHub workflow commits and synchronizations.",
      technologies: ["Automation", "Git", "GitHub API", "Workflow Scripting"],
      status: "EXPERIMENT",
      github: "https://github.com/Kishore-2007-web/auto-git-pusher",
      live: null,
      highlight: "Automates repetitive version control routines to speed up developer workflows."
    },
    {
      id: "fossage-26",
      title: "FOSSAGE 26",
      category: "UI/UX × Editorial Magazine",
      description: "A digital magazine design study exploring open-source software culture, visual storytelling, modern typography, and high-fidelity Figma layout systems.",
      technologies: ["Figma", "UI/UX", "Editorial Design", "Open Source Culture"],
      status: "DESIGN STUDY",
      github: "https://github.com/Kishore-2007-web",
      live: null,
      highlight: "High-end visual communication and layout exploration."
    },
    {
      id: "thachan",
      title: "THACHAN",
      category: "Carpenter Manpower Finder",
      description: "A digital manpower platform connecting skilled carpenter craftsmen with local construction, residential interior, and commercial carpentry jobs.",
      technologies: ["React", "Node.js", "Web Architecture", "Database Design"],
      status: "IN DEVELOPMENT (TEAM PROJECT)",
      github: null,
      live: null,
      highlight: "Real-world platform addressing skilled blue-collar labor discovery."
    },
    {
      id: "crimenet-ai",
      title: "CrimeNET AI",
      category: "AI Security Interface Prototype",
      description: "An experimental crime analytics and public safety intelligence network interface prototype designed for predictive risk insight.",
      technologies: ["AI", "Security Interface", "Frontend Prototype"],
      status: "PRIVATE PROTOTYPE",
      github: null,
      live: null,
      highlight: "Visual intelligence prototype for civic safety data."
    },
    {
      id: "kishore-portfolio-2026",
      title: "Kishore Portfolio (Digital Laboratory)",
      category: "Creative Engineering & 3D Web",
      description: "Kishore's personal portfolio built with a monochrome digital laboratory aesthetic, automatic black/white theme switching, Three.js 3D physics lanyard, circular project galleries, infinite skill spirals, and WhatsApp direct connection.",
      technologies: ["React", "Vite", "Three.js", "OGL", "GSAP", "Vanilla CSS"],
      status: "LIVE",
      github: "https://github.com/Kishore-2007-web",
      live: "https://kishore-portfolio.vercel.app",
      highlight: "Cinematic, dark/light alternating aesthetic with high-performance 3D canvas shaders."
    }
  ],

  experienceAndGoals: {
    internshipInterests: [
      "Software Development Internships (Web / Full-Stack / Frontend / Backend)",
      "AI & Machine Learning Engineering Internships",
      "Game Development & 3D Interactive Graphics Internships",
      "Cybersecurity Engineering & Tooling"
    ],
    availability: "Open to exciting software, web development, AI, and game development internship opportunities, freelance technical projects, and creative collaborations.",
    workStyle: "Rapid prototyping, purpose-driven architecture, continuous open-source building in public, clean UI/UX with solid engineering foundations."
  },

  contact: {
    email: siteConfig.contact.email,
    github: siteConfig.contact.github,
    githubUsername: siteConfig.githubProfile.username,
    linkedin: siteConfig.contact.linkedin,
    whatsappPhone: WHATSAPP_CONFIG.rawNumber,
    whatsappUrl: siteConfig.contact.whatsappLink,
    portfolioUrl: "https://kishore-portfolio.vercel.app"
  }
};
