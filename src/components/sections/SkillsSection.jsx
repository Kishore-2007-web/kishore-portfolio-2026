import React from 'react';
import InfiniteSpiral from '../reactbits/InfiniteSpiral/InfiniteSpiral';
import {
  Code,
  FileCode,
  Code2,
  Atom,
  Terminal,
  Flame,
  Database,
  Webhook,
  Box,
  Gamepad2,
  Shapes,
  Layers,
  GitBranch,
  Github,
  Puzzle,
  MessageSquare,
  Users,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const skillItems = [
  { id: 'html', title: 'HTML', icon: <FileCode size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'css', title: 'CSS', icon: <Code size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'javascript', title: 'JavaScript', icon: <Code2 size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'react', title: 'React', icon: <Atom size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'python', title: 'Python Basics', icon: <Terminal size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'firebase', title: 'Firebase', icon: <Flame size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'mongodb', title: 'MongoDB', icon: <Database size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'api', title: 'API Integration', icon: <Webhook size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'unity', title: 'Unity', icon: <Box size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'unreal', title: 'Unreal Engine', icon: <Gamepad2 size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'blender', title: 'Blender', icon: <Shapes size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'maya', title: 'Maya', icon: <Layers size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'git', title: 'Git', icon: <GitBranch size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'github', title: 'GitHub', icon: <Github size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'problem-solving', title: 'Problem Solving', icon: <Puzzle size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'communication', title: 'Communication', icon: <MessageSquare size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'teamwork', title: 'Teamwork', icon: <Users size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'creativity', title: 'Creativity', icon: <Sparkles size={34} strokeWidth={2} color="#ffffff" /> },
  { id: 'adaptability', title: 'Adaptability', icon: <RefreshCw size={34} strokeWidth={2} color="#ffffff" /> },
];

export function SkillsSection() {
  return (
    <section
      id="skills"
      style={{
        padding: '100px 0 80px 0',
        background: '#000000',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div className="section-tag">03 — SKILLS & TECH</div>

        <h2 className="section-heading" style={{ marginBottom: '12px' }}>
          TECHNICAL & SOFT SKILLS.
        </h2>

        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem',
            maxWidth: '560px',
            marginBottom: '48px',
            lineHeight: 1.6,
          }}
        >
          An interactive 3D spiral showcasing my technical stack, 3D/game development toolset, and core soft skills.
        </p>

        {/* 3D Infinite Spiral Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            minHeight: '460px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0) 70%)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <InfiniteSpiral
            items={skillItems}
            animationMode="all"
            speed={0.8}
            radius={180}
            cardWidth={120}
            cardHeight={120}
            verticalSpacing={65}
            perspective={1000}
            cardRadius={14}
            centerScale={1.25}
            edgeBlur={2}
            cardsPerTurn={7}
            pauseOnHover={false}
          />
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
