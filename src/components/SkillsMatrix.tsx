import React from 'react';
import { Cpu, Code2, Box, BrainCircuit, Activity } from 'lucide-react';
import { sound } from '../utils/audio';

export const SkillsMatrix: React.FC = () => {
  const skillCategories = [
    {
      title: 'Languages & Core Systems',
      icon: <Code2 size={20} color="#3884ff" />,
      skills: [
        { name: 'TypeScript / ESNext', level: 'Expert · 5+ yrs' },
        { name: 'Python (FastAPI, PyTorch)', level: 'Advanced' },
        { name: 'Rust & C / C++', level: 'Systems level' },
        { name: 'Swift & Metal 3', level: 'Native iOS / macOS' },
        { name: 'GLSL / WGSL Shaders', level: 'Graphics pipeline' },
        { name: 'SQL & Vector DBs (Qdrant)', level: 'High throughput' }
      ]
    },
    {
      title: '3D Graphics & Creative Web',
      icon: <Box size={20} color="#00d2ff" />,
      skills: [
        { name: 'Three.js (r165 Ecosystem)', level: 'Mastery' },
        { name: 'Custom GLSL Material Shaders', level: 'Advanced' },
        { name: 'WebGPU Compute Pipelines', level: 'Modern rendering' },
        { name: 'Figma Design System Tokens', level: 'AAA Accessibility' },
        { name: 'Framer Motion & Web Audio API', level: 'Micro-interactions' },
        { name: 'Blender 3D Mesh Modeling', level: 'Assets & Rigging' }
      ]
    },
    {
      title: 'AI & Autonomous Architectures',
      icon: <BrainCircuit size={20} color="#ff7a45" />,
      skills: [
        { name: 'Autonomous Multi-Agent DAGs', level: 'LangGraph & Codex' },
        { name: 'Contextual Reasoning Pipelines', level: 'Claude Code style' },
        { name: 'Dense/Sparse RAG & Ontologies', level: 'Clinical & Technical' },
        { name: 'AST Codebase Indexing', level: 'Automated refactoring' },
        { name: 'Headless Browser Proof Loops', level: 'Visual assertions' },
        { name: 'Edge Neural Inference (CoreML)', level: 'Quantized models' }
      ]
    },
    {
      title: 'Robotics & Distributed Systems',
      icon: <Activity size={20} color="#10b981" />,
      skills: [
        { name: 'Sawyer 7-DOF Kinematics & IK', level: 'DLS & Jacobians' },
        { name: 'ROS2 & Binary WebSockets', level: 'Sub-15ms sync' },
        { name: 'Docker & Kubernetes CI/CD', level: 'Containerization' },
        { name: 'Redis Streams & Geospatial H3', level: 'Sub-second dispatch' },
        { name: 'FreeRTOS & Embedded Sensors', level: 'Low-power IoT' },
        { name: 'CRDTs & Offline Bluetooth Mesh', level: 'P2P resilience' }
      ]
    }
  ];

  return (
    <section className="portfolio-section" id="technical-stack">
      <div className="section-header">
        <div className="section-eyebrow">
          <Cpu size={14} />
          <span>Technical Capabilities</span>
        </div>
        <h2 className="section-title">Engineering Mastery & Tooling</h2>
        <p className="section-deck">
          A balanced synthesis of low-level systems programming, real-time 3D spatial computing, autonomous agent graphs, and native hardware interfaces.
        </p>
      </div>

      <div className="skills-container">
        {skillCategories.map((cat, idx) => (
          <div
            key={idx}
            className="skill-category-card"
            onMouseEnter={() => sound.playClick()}
          >
            <div className="skill-cat-title">
              {cat.icon}
              <span>{cat.title}</span>
            </div>

            <div className="skill-list">
              {cat.skills.map((skill, sIdx) => (
                <div key={sIdx} className="skill-item">
                  <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{skill.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
