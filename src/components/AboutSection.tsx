import React from 'react';
import { User, GraduationCap, Cpu, Layers, Mail, ArrowUpRight, ExternalLink, ArrowDown } from 'lucide-react';

interface AboutSectionProps {
  onExploreProjects?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreProjects }) => {
  return (
    <section className="about-dossier-section" id="about">
      <div className="about-dossier-wrapper">
        
        {/* Section Header / Archival Meta */}
        <div className="about-section-top">
          <div className="about-section-tag">
            <span>DOSSIER // 01</span>
            <span className="about-section-tag-divider">—</span>
            <span>PROFILE & TECHNICAL PHILOSOPHY</span>
          </div>
          <div className="about-availability-pill">
            <span className="about-pulse-dot" />
            <span>Available for Roles & Research · Vienna / Remote</span>
          </div>
        </div>

        {/* Main Editorial Grid */}
        <div className="about-dossier-grid">
          
          {/* Left Column: Profile, Institution & Background Narrative */}
          <div className="about-left-col">
            <h2 className="about-heading-serif">
              Engineering autonomous physical-digital systems with mathematical rigor.
            </h2>

            <div className="about-institution-badge">
              <GraduationCap size={16} className="about-badge-icon" />
              <div>
                <span className="about-inst-name">Hochschule Campus Wien</span>
                <span className="about-inst-field">Computer Science · Autonomous Systems & Robotics</span>
              </div>
            </div>

            <div className="about-narrative-block">
              <p className="about-narrative-p">
                I am a software and robotics systems engineer focused on the synthesis of <strong>autonomous AI agent orchestration</strong>, 
                <strong> physical robotics kinematics</strong>, and <strong>high-reliability backend infrastructure</strong>.
              </p>
              <p className="about-narrative-p">
                My research and production implementations range from sub-50ms embedded motor safety reflex interceptors on physical robots 
                to multi-agent emergency dispatch networks, graph-based warehouse optimization, and fine-grained neural vision architectures.
              </p>
              <p className="about-narrative-p">
                I prioritize zero-compromise runtime performance (such as event-driven zero-load WebGL rendering), 
                deterministic graph state machines, and elegant, tactile interface design.
              </p>
            </div>

            {/* Direct Contact Action Row */}
            <div className="about-actions-row">
              <a 
                href="mailto:contact@kaschefi.dev" 
                className="about-contact-btn about-contact-btn--primary"
              >
                <Mail size={15} />
                <span>contact@kaschefi.dev</span>
                <ArrowUpRight size={14} />
              </a>

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

          {/* Right Column: Core Competencies Matrix & Volume Navigation */}
          <div className="about-right-col">
            <div className="about-matrix-header">
              <Cpu size={15} />
              <span>CORE ARCHITECTURAL DOMAINS</span>
            </div>

            <div className="about-cards-matrix">
              <div className="about-card">
                <div className="about-card-number">01</div>
                <div className="about-card-content">
                  <h3 className="about-card-title">Autonomous Agents & RAG</h3>
                  <p className="about-card-desc">
                    LangGraph state machines, FAISS vector tool selection, local Ollama LLMs, FastEmbed semantic routers, and structured MCP integration.
                  </p>
                </div>
              </div>

              <div className="about-card">
                <div className="about-card-number">02</div>
                <div className="about-card-content">
                  <h3 className="about-card-title">Robotics & Real-Time Kinematics</h3>
                  <p className="about-card-desc">
                    Sawyer 7-DOF manipulator control, PyCozmo kinematics, OpenCV optical flow, 33Hz IMU reflex interceptors, and collision avoidance.
                  </p>
                </div>
              </div>

              <div className="about-card">
                <div className="about-card-number">03</div>
                <div className="about-card-content">
                  <h3 className="about-card-title">Backend Systems & Scalability</h3>
                  <p className="about-card-desc">
                    Python (FastAPI), TypeScript / Node.js, PostgreSQL dual-tier memory, Docker containers, Redis, and real-time WebSocket streams.
                  </p>
                </div>
              </div>

              <div className="about-card">
                <div className="about-card-number">04</div>
                <div className="about-card-content">
                  <h3 className="about-card-title">Interactive Graphics & WebGL</h3>
                  <p className="about-card-desc">
                    Three.js physical shaders, custom GLSL Navier-Stokes Eulerian fluid solvers, on-demand GPU idle architectures, and React.
                  </p>
                </div>
              </div>
            </div>

            {/* Flow to Bookshelf Cue */}
            {onExploreProjects && (
              <div className="about-shelf-cue">
                <div className="about-shelf-cue-text">
                  <Layers size={14} />
                  <span>Documented across 6 interactive engineering volumes below</span>
                </div>
                <button 
                  onClick={onExploreProjects} 
                  className="about-shelf-cue-btn"
                  aria-label="Scroll to 3D Bookshelf"
                >
                  <span>Explore Research Volumes</span>
                  <ArrowDown size={14} />
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
