import React from 'react';
import { X, User, GraduationCap, Cpu, Layers, ExternalLink, Mail, ArrowUpRight } from 'lucide-react';

interface AboutDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDossierModal: React.FC<AboutDossierModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="about-modal-backdrop" onClick={onClose}>
      <div 
        className="about-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-dossier-title"
      >
        {/* Header Bar */}
        <div className="about-modal-header">
          <div className="about-header-meta">
            <span className="about-tag">DOSSIER // 01</span>
            <span className="about-tag-divider">•</span>
            <span className="about-tag-sub">ENGINEERING PROFILE & BACKGROUND</span>
          </div>
          <button 
            className="about-close-btn" 
            onClick={onClose}
            aria-label="Close About Dossier"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="about-modal-body">
          {/* Hero Profile Intro */}
          <div className="about-profile-hero">
            <div className="about-title-block">
              <span className="about-role-eyebrow">SYSTEMS ARCHITECT & RESEARCHER</span>
              <h2 id="about-dossier-title" className="about-name-title">
                Mohammad <span className="about-name-serif">Kashefirad</span>
              </h2>
              <p className="about-institution-line">
                <GraduationCap size={15} className="about-inline-icon" />
                <span>Hochschule Campus Wien · Computer Science & Intelligent Systems</span>
              </p>
            </div>

            <div className="about-availability-badge">
              <span className="about-pulse-dot" />
              <span>Available for Roles & Research Collaboration (Vienna / Hybrid / Remote)</span>
            </div>
          </div>

          <hr className="about-divider" />

          {/* Bio Narrative */}
          <div className="about-section-block">
            <h3 className="about-section-heading">
              <User size={15} className="about-heading-icon" />
              <span>Technical Focus & Philosophy</span>
            </h3>
            <p className="about-paragraph">
              I am an engineer focused on the synthesis of <strong>autonomous AI agent orchestration</strong>, 
              <strong> physical robotics kinematics</strong>, and <strong>high-reliability backend infrastructure</strong>. 
              My work spans from sub-50ms embedded motor safety reflex interceptors on physical robots to multi-agent emergency dispatch systems, 
              graph-based optimization pipelines, and fine-grained neural classification models.
            </p>
            <p className="about-paragraph">
              I believe in building software that balances high-craft user aesthetics and tactile physicality with rigorous, 
              zero-compromise performance and deterministic execution.
            </p>
          </div>

          {/* Core Competencies Matrix */}
          <div className="about-section-block">
            <h3 className="about-section-heading">
              <Cpu size={15} className="about-heading-icon" />
              <span>Core Competencies & Stack</span>
            </h3>
            <div className="about-skills-grid">
              <div className="about-skill-card">
                <span className="about-skill-category">Autonomous Agents & AI</span>
                <p className="about-skill-desc">LangGraph, Dynamic Tool RAG, FAISS Vector Indexing, Ollama, FastEmbed, ONNX Runtime</p>
              </div>

              <div className="about-skill-card">
                <span className="about-skill-category">Robotics & Kinematics</span>
                <p className="about-skill-desc">PyCozmo, Sawyer Robot, Forward/Inverse Kinematics, OpenCV Optical Flow, IMU Telemetry</p>
              </div>

              <div className="about-skill-card">
                <span className="about-skill-category">Backend & Distributed Systems</span>
                <p className="about-skill-desc">Python (FastAPI), TypeScript / Node.js, PostgreSQL, Docker, Redis, WebSocket Streams</p>
              </div>

              <div className="about-skill-card">
                <span className="about-skill-category">Creative Web & Graphics</span>
                <p className="about-skill-desc">Three.js, WebGL Shaders (GLSL Eulerian Fluid Solvers), React, TailwindCSS, Canvas APIs</p>
              </div>
            </div>
          </div>

          {/* Education & Academic Volumes */}
          <div className="about-section-block">
            <h3 className="about-section-heading">
              <Layers size={15} className="about-heading-icon" />
              <span>Academic Engineering Archive</span>
            </h3>
            <div className="about-timeline-item">
              <div className="about-timeline-header">
                <span className="about-degree">FH Campus Wien</span>
                <span className="about-year">2023 — Present</span>
              </div>
              <p className="about-timeline-sub">
                Engineering student investigating autonomous physical-digital systems, real-time kinematics, and graph optimization algorithms.
              </p>
            </div>
          </div>

          <hr className="about-divider" />

          {/* Contact & Outbound Links */}
          <div className="about-footer-actions">
            <a 
              href="mailto:contact@kaschefi.dev" 
              className="about-contact-btn about-contact-btn--primary"
            >
              <Mail size={15} />
              <span>contact@kaschefi.dev</span>
              <ArrowUpRight size={14} />
            </a>

            <div className="about-social-row">
              <a 
                href="https://github.com/kaschefi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="about-link-pill"
              >
                <span>GitHub</span>
                <ExternalLink size={12} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="about-link-pill"
              >
                <span>LinkedIn</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
