/**
 * Local AI Assistant Service Layer
 * 
 * Supports:
 * 1. Built-in Local Portfolio Intelligence Engine (runs 100% locally in browser, zero external dependencies)
 * 2. Optional Local LLM connection (Ollama / Local OpenAI-compatible endpoints)
 * 3. Anti-hallucination grounding strictly against kishoreKnowledge
 * 4. Multi-turn session context tracking
 */

import { kishoreKnowledge } from '../knowledge/kishoreKnowledge';

export const AI_CONFIG = {
  assistantName: 'KISA',
  assistantSubtitle: 'Portfolio Intelligence Assistant',
  localEndpoint: 'http://localhost:11434/v1/chat/completions',
  defaultModel: 'llama3:latest',
};

/**
 * Normalizes query string for keyword and semantic matching
 */
function normalizeQuery(text) {
  return text.toLowerCase().replace(/[^\w\s]/gi, ' ').trim();
}

/**
 * Searches the structured knowledge base for relevant facts
 */
function retrieveKnowledgeContext(query, sessionContext) {
  const norm = normalizeQuery(query);
  const words = norm.split(/\s+/).filter(Boolean);

  let activeProject = null;

  // Check if query refers directly to a known project
  for (const proj of kishoreKnowledge.projects) {
    const projSlug = proj.id.replace(/-/g, ' ');
    const projTitle = proj.title.toLowerCase();
    if (norm.includes(proj.id) || norm.includes(projSlug) || norm.includes(projTitle)) {
      activeProject = proj;
      break;
    }
  }

  // Handle follow-up pronouns ("it", "this project", "that", "the project")
  if (!activeProject && sessionContext?.lastProject) {
    const isFollowup = words.some(w => ['it', 'this', 'that', 'project', 'tech', 'stack', 'details'].includes(w));
    if (isFollowup) {
      activeProject = sessionContext.lastProject;
    }
  }

  return {
    activeProject,
    norm,
    words
  };
}

/**
 * Built-in Grounded Local Portfolio Intelligence
 * Deterministic, anti-hallucinatory, fast, and 100% private.
 */
function generateLocalGroundedResponse(query, contextState) {
  const { activeProject, norm, words } = retrieveKnowledgeContext(query, contextState);

  // 1. Specific Project Inquiries
  if (activeProject) {
    const techQuery = words.some(w => ['tech', 'technology', 'stack', 'built', 'languages', 'tools', 'framework'].includes(w));
    const linkQuery = words.some(w => ['github', 'link', 'source', 'repo', 'repository', 'url', 'live', 'website'].includes(w));

    if (techQuery) {
      return {
        reply: `**${activeProject.title}** is built with:\n\n` +
          activeProject.technologies.map(t => `- **${t}**`).join('\n') +
          `\n\n**Category**: ${activeProject.category}\n` +
          `**Status**: ${activeProject.status}` +
          (activeProject.github ? `\n\n🔗 [View on GitHub](${activeProject.github})` : '') +
          (activeProject.live ? ` · [Live Demo](${activeProject.live})` : ''),
        activeProject
      };
    }

    if (linkQuery) {
      let linksText = `Links for **${activeProject.title}**:\n\n`;
      if (activeProject.github) linksText += `- **GitHub Repository**: [${activeProject.github}](${activeProject.github})\n`;
      if (activeProject.live) linksText += `- **Live Deployment**: [${activeProject.live}](${activeProject.live})\n`;
      if (!activeProject.github && !activeProject.live) {
        linksText += `*${activeProject.title} is currently a ${activeProject.status.toLowerCase()} and does not have a public URL.*`;
      }
      return { reply: linksText, activeProject };
    }

    // Default project overview
    let response = `**${activeProject.title}** (${activeProject.category})\n\n`;
    response += `${activeProject.description}\n\n`;
    response += `**Status**: \`${activeProject.status}\`\n\n`;
    response += `**Technologies**:\n` + activeProject.technologies.map(t => `- ${t}`).join('\n');
    
    if (activeProject.github || activeProject.live) {
      response += `\n\n**Links**:`;
      if (activeProject.github) response += ` [GitHub](${activeProject.github})`;
      if (activeProject.github && activeProject.live) response += ` · `;
      if (activeProject.live) response += ` [Live Demo](${activeProject.live})`;
    }

    response += `\n\n*Would you like to know more about the technologies used or other related projects?*`;

    return {
      reply: response,
      activeProject
    };
  }

  // 2. Who is Kishore / Profile / Bio
  if (
    norm.includes('who is kishore') ||
    norm.includes('tell me about kishore') ||
    norm.includes('about kishore') ||
    norm.includes('who are you') ||
    norm.includes('who made') ||
    norm.includes('what kind of developer') ||
    norm.includes('profile')
  ) {
    return {
      reply: `**Kishore** is a Computer Science student, web developer, UI/UX designer, software developer, game developer, and 3D creator.\n\n` +
        `He focuses on **useful digital experiences with real-world impact**, governed by his philosophy: \n\n` +
        `> **"PURPOSE OVER FANCY."**\n> Technology is a tool to create real impact rather than building something simply because it looks fancy.\n\n` +
        `His primary areas of exploration include:\n` +
        `- **Web & Software**: React, JavaScript, Node.js, and REST APIs\n` +
        `- **AI & Automation**: Conversational AI (Kisa AI) & security scanning (RepoShield AI)\n` +
        `- **3D & Game Dev**: Unreal Engine, Unity, Blender, and Maya\n` +
        `- **Cybersecurity**: Device integrity prototypes like USBShield\n\n` +
        `You can connect with him directly on [WhatsApp](${kishoreKnowledge.contact.whatsappUrl}) or explore his [GitHub](${kishoreKnowledge.contact.github}).`,
      activeProject: null
    };
  }

  // 3. What projects has Kishore built? / All projects
  if (
    norm.includes('project') ||
    norm.includes('what has he built') ||
    norm.includes('what did he build') ||
    norm.includes('show me his work') ||
    norm.includes('portfolio work') ||
    norm.includes('builds')
  ) {
    return {
      reply: `Here are some of the key projects Kishore has built:\n\n` +
        `### Featured Projects\n` +
        `- **[Kisa AI](https://kisa-ai.vercel.app)** — Personal conversational AI assistant & chatbot.\n` +
        `- **[CalculatorHub](https://calculatorhub-gold.vercel.app/)** — Computational platform with 300+ specialized calculators.\n` +
        `- **[My Pocket Tracker](https://my-pocket-tracker.vercel.app)** — Unified expense tracker and personal finance manager.\n` +
        `- **The Room** — Psychological horror game built in Unreal Engine.\n` +
        `- **THACHAN** — Carpenter manpower discovery platform connecting craftsmen with builders.\n` +
        `- **Tamil App** — Language learning and Tamil heritage interactive application.\n\n` +
        `### Lab & Experimental Builds\n` +
        `- **USBShield** — Lightweight USB device safety scanner and cybersecurity prototype.\n` +
        `- **RepoShield AI** — AI-powered repository vulnerability and risk inspection.\n` +
        `- **Rise of Aran** — Tamil-heritage-inspired 3D action game experiment.\n` +
        `- **Auto Git Pusher** — Developer automation utility for Git commit workflows.\n` +
        `- **FOSSAGE 26** — Editorial digital magazine design study celebrating open source.\n\n` +
        `*Ask me about any specific project (e.g. "Tell me about USBShield" or "What is CalculatorHub?") to see details.*`,
      activeProject: null
    };
  }

  // 4. Technologies & Skills
  if (
    norm.includes('skill') ||
    norm.includes('technolog') ||
    norm.includes('tech stack') ||
    norm.includes('what tools') ||
    norm.includes('language') ||
    norm.includes('what does he use') ||
    norm.includes('programming')
  ) {
    const isWeb = norm.includes('web');
    const isAI = norm.includes('ai') || norm.includes('artificial');
    const isGame = norm.includes('game') || norm.includes('3d') || norm.includes('unreal') || norm.includes('blender');

    if (isWeb) {
      return {
        reply: `**Kishore's Web Development Stack**:\n\n` +
          `- **Frontend**: HTML5, CSS3 / Vanilla CSS (Glassmorphism, CSS Variables, Responsive), JavaScript (ES6+), React\n` +
          `- **Backend & APIs**: Node.js, REST APIs, LocalStorage API\n` +
          `- **Databases & Cloud**: Firebase, MongoDB\n` +
          `- **Interactive & 3D Web**: Three.js, OGL, WebGL shaders, Canvas animations\n` +
          `- **Deployment**: Vercel, Git/GitHub`,
        activeProject: null
      };
    }

    if (isAI) {
      return {
        reply: `**Kishore's AI & Automation Projects**:\n\n` +
          `- **Kisa AI**: A personal conversational AI chatbot and intelligence interface.\n` +
          `- **RepoShield AI**: An AI-driven static code scanner identifying repository vulnerabilities.\n` +
          `- **CrimeNET AI**: Experimental interface prototype for public safety intelligence.\n` +
          `- **Skills & Tools**: Python Basics, API Integration, Prompt Architecture, and Automation scripts.`,
        activeProject: null
      };
    }

    if (isGame) {
      return {
        reply: `**Kishore's Game Development & 3D Toolset**:\n\n` +
          `- **Game Engines**: Unreal Engine (first-person horror mechanics, lighting, audio), Unity\n` +
          `- **3D Modeling & Animation**: Blender, Maya\n` +
          `- **Notable Games**: \n` +
          `  - *The Room* (Unreal Engine horror game)\n` +
          `  - *Rise of Aran* (Tamil-heritage 3D action game experiment)`,
        activeProject: null
      };
    }

    return {
      reply: `Here is a summary of Kishore's technical stack:\n\n` +
        `### Web Development\n` +
        `HTML5, CSS3, JavaScript (ES6+), React, Node.js, REST APIs, Firebase, MongoDB\n\n` +
        `### Game Dev & 3D\n` +
        `Unreal Engine, Unity, Blender, Maya, Three.js / WebGL\n\n` +
        `### Tools & Design\n` +
        `Git, GitHub, VS Code, Figma, Canva, Antigravity\n\n` +
        `### Programming Languages\n` +
        `JavaScript, Python (Basics), C++ (Basics for Unreal Engine)\n\n` +
        `### Core Soft Skills\n` +
        `Problem Solving, Technical Communication, Teamwork, Creativity, and Adaptability.`,
      activeProject: null
    };
  }

  // 5. Game Dev / Unreal Engine specific
  if (norm.includes('unreal') || norm.includes('game') || norm.includes('the room') || norm.includes('rise of aran')) {
    return {
      reply: `Yes, Kishore works with **Unreal Engine** and **Unity** for game development.\n\n` +
        `His primary game projects include:\n\n` +
        `1. **The Room** — A single-player psychological horror game built in Unreal Engine with atmospheric lighting, 3D audio, and puzzle mechanics.\n` +
        `2. **Rise of Aran** — A 3D action game prototype celebrating Tamil heritage and cultural storytelling.\n\n` +
        `He also uses **Blender** and **Maya** for 3D asset creation and scene design.`,
      activeProject: null
    };
  }

  // 6. 3D Software
  if (norm.includes('3d') || norm.includes('blender') || norm.includes('maya')) {
    return {
      reply: `Kishore uses **Blender** and **Maya** for 3D modeling, texturing, and asset design, as well as **Three.js** and **OGL** for interactive 3D WebGL experiences on the web (such as the 3D physics lanyard on his portfolio).`,
      activeProject: null
    };
  }

  // 7. Contact Info & Links
  if (
    norm.includes('contact') ||
    norm.includes('email') ||
    norm.includes('whatsapp') ||
    norm.includes('phone') ||
    norm.includes('message') ||
    norm.includes('reach') ||
    norm.includes('hire') ||
    norm.includes('talk to kishore')
  ) {
    return {
      reply: `You can reach Kishore directly through the following channels:\n\n` +
        `- 💬 **WhatsApp**: [Chat with Kishore directly on WhatsApp](${kishoreKnowledge.contact.whatsappUrl}) (Phone: \`+91 88386 35463\`)\n` +
        `- ✉️ **Email**: [${kishoreKnowledge.contact.email}](mailto:${kishoreKnowledge.contact.email})\n` +
        `- 🐙 **GitHub**: [${kishoreKnowledge.contact.github}](${kishoreKnowledge.contact.github})\n` +
        `- 💼 **LinkedIn**: [Kishore on LinkedIn](${kishoreKnowledge.contact.linkedin})\n\n` +
        `*WhatsApp typically has the fastest response time for collaboration, freelance inquiries, and questions.*`,
      activeProject: null
    };
  }

  // 8. GitHub
  if (norm.includes('github') || norm.includes('repo') || norm.includes('open source')) {
    return {
      reply: `Kishore's GitHub username is **[@Kishore-2007-web](https://github.com/Kishore-2007-web)**.\n\n` +
        `He believes in **"Building in Public"**, exploring open-source projects, and sharing experimental codebases. Check out his profile at: [github.com/Kishore-2007-web](https://github.com/Kishore-2007-web).`,
      activeProject: null
    };
  }

  // 9. Education / College / Degree
  if (
    norm.includes('education') ||
    norm.includes('college') ||
    norm.includes('degree') ||
    norm.includes('university') ||
    norm.includes('student') ||
    norm.includes('study') ||
    norm.includes('school')
  ) {
    return {
      reply: `**Education**:\n\n` +
        `- **Degree**: Undergraduate Computer Science and Engineering (CSE) student.\n` +
        `- **Focus Areas**: Software engineering, web systems, artificial intelligence, 3D graphics, and computer security.\n` +
        `- **Philosophy**: Focuses heavily on hands-on practical implementation — building functional software rather than just studying theory.`,
      activeProject: null
    };
  }

  // 10. Internships / Opportunities / Career Goals
  if (
    norm.includes('intern') ||
    norm.includes('job') ||
    norm.includes('work with') ||
    norm.includes('opportunit') ||
    norm.includes('hire') ||
    norm.includes('looking for')
  ) {
    return {
      reply: `Kishore is actively looking for **internship opportunities and project collaborations** in:\n\n` +
        `- **Software & Web Development** (Frontend, Full-Stack, or React)\n` +
        `- **AI & Machine Learning Engineering**\n` +
        `- **3D Interactive & Game Development** (Unreal Engine / Unity / WebGL)\n` +
        `- **Cybersecurity Prototyping**\n\n` +
        `If you have an opportunity or project, you can [message Kishore on WhatsApp](${kishoreKnowledge.contact.whatsappUrl}) or email him at [${kishoreKnowledge.contact.email}](mailto:${kishoreKnowledge.contact.email}).`,
      activeProject: null
    };
  }

  // 11. Portfolio details
  if (norm.includes('portfolio') || norm.includes('website') || norm.includes('design')) {
    return {
      reply: `This portfolio is designed as a **Cinematic Digital Laboratory**.\n\n` +
        `Key features include:\n` +
        `- **Automatic Two-Theme System**: Alternates between Black and White themes seamlessly on refresh.\n` +
        `- **3D Physics Interactive Lanyard**: Built with Three.js and Rapier physics.\n` +
        `- **3D Circular Gallery**: Interactive rotatable lab showcase.\n` +
        `- **Infinite Skill Spiral**: 3D spiral displaying technologies and tools.\n` +
        `- **Volumetric Light Rays**: High-performance WebGL shader lighting.\n` +
        `- **Direct WhatsApp Connection**: Built-in instant messaging with desktop QR scanner.\n` +
        `- **KISA Local AI Assistant**: Context-aware portfolio intelligence.\n\n` +
        `Everything is built with React, Vite, Three.js, and Vanilla CSS.`,
      activeProject: null
    };
  }

  // 12. Anti-Hallucination Fallback Guard
  return {
    reply: `I don't have that specific information in Kishore's portfolio knowledge base yet.\n\n` +
      `Kishore's portfolio focuses on his verified work, technical skills, projects, and contact channels. Here are some topics you can ask me about:\n\n` +
      `- **Who is Kishore?** (His developer profile & philosophy)\n` +
      `- **What projects has he built?** (e.g. *USBShield*, *Kisa AI*, *CalculatorHub*, *Rise of Aran*, *The Room*)\n` +
      `- **What technologies does he use?** (Web, React, Python, Unreal Engine, Blender)\n` +
      `- **What internships is he looking for?**\n` +
      `- **How can I contact Kishore?** (Direct WhatsApp, Email, GitHub, LinkedIn)`,
    activeProject: null
  };
}

/**
 * Main AI Assistant Dispatcher
 * Queries local LLM if configured; otherwise seamlessly uses grounded local intelligence.
 */
export async function sendAIMessage(userMessage, conversationHistory = [], sessionContext = {}) {
  // Check if an external local LLM endpoint is enabled and available
  const customEndpoint = (typeof window !== 'undefined' && window.__LOCAL_LLM_ENDPOINT__) || null;

  if (customEndpoint) {
    try {
      const systemPrompt = `You are KISA, the AI assistant for Kishore's portfolio. Answer questions ONLY about Kishore, his projects, skills, education, and contact based strictly on the following knowledge base. If information is not in the knowledge base, state that it is not available. Do not hallucinate or invent facts.\n\nKnowledge Base:\n${JSON.stringify(kishoreKnowledge, null, 2)}`;
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch(customEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: AI_CONFIG.defaultModel,
          messages,
          temperature: 0.3,
          max_tokens: 500
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || data.message?.content;
        if (content) {
          return {
            reply: content.trim(),
            provider: 'Local LLM (Connected)',
            sessionContext
          };
        }
      }
    } catch (err) {
      console.warn('Local LLM endpoint offline or timed out, falling back to Local Grounded Intelligence:', err);
    }
  }

  // Fast, deterministic, anti-hallucinatory local grounded intelligence
  // Add a realistic 350ms processing pause for conversational feel
  await new Promise(res => setTimeout(res, 350));

  const result = generateLocalGroundedResponse(userMessage, sessionContext);

  return {
    reply: result.reply,
    provider: 'Local Portfolio Intelligence',
    sessionContext: {
      ...sessionContext,
      lastProject: result.activeProject || sessionContext.lastProject
    }
  };
}
