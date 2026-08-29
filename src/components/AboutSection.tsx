import React, { useState } from 'react';
import {
  Layers,
  ExternalLink,
  Code2,
  BrainCircuit,
  Boxes,
  Database,
  Activity,
  Sparkles,
  Terminal,
  Eye,
  Workflow,
  Server,
  Smartphone,
  Coffee,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SteamCard3D } from './SteamCard3D';

interface SkillItem {
  name: string;
  category: string;
  icon: React.ReactNode;
  accentColor: string;
}

const SKILLS_DATA: SkillItem[] = [
  {
    name: 'LangGraph & Multi-Agent',
    category: 'AI Architectures',
    icon: <BrainCircuit size={15} />,
    accentColor: '#3884ff'
  },
  {
    name: 'Python & PyTorch',
    category: 'Core Systems & ML',
    icon: <Code2 size={15} />,
    accentColor: '#3884ff'
  },
  {
    name: 'Java',
    category: 'Object-Oriented & JVM',
    icon: <Coffee size={15} />,
    accentColor: '#f97316'
  },
  {
    name: 'Three.js & WebGL Shaders',
    category: '3D Graphics & GPU',
    icon: <Boxes size={15} />,
    accentColor: '#00d2ff'
  },
  {
    name: 'ROS / ROS2 Middleware',
    category: 'Robotics Control',
    icon: <Activity size={15} />,
    accentColor: '#10b981'
  },
  {
    name: 'TypeScript & React',
    category: 'Web Engineering',
    icon: <Terminal size={15} />,
    accentColor: '#3884ff'
  },
  {
    name: 'Computer Vision & OpenCV',
    category: 'Neural Vision',
    icon: <Eye size={15} />,
    accentColor: '#a855f7'
  },
  {
    name: 'FastAPI & Microservices',
    category: 'Backend Systems',
    icon: <Server size={15} />,
    accentColor: '#10b981'
  },
  {
    name: 'PostgreSQL & Redis Streams',
    category: 'Data & Persistence',
    icon: <Database size={15} />,
    accentColor: '#f59e0b'
  },
  {
    name: 'Vector RAG & FastEmbed',
    category: 'Cognitive Pipelines',
    icon: <Sparkles size={15} />,
    accentColor: '#3884ff'
  },
  {
    name: 'Docker & Containerization',
    category: 'DevOps & Tooling',
    icon: <Layers size={15} />,
    accentColor: '#06b6d4'
  },
  {
    name: 'Graph Theory & Algorithms',
    category: 'Dijkstra & MST',
    icon: <Workflow size={15} />,
    accentColor: '#ec4899'
  },
  {
    name: 'Kotlin',
    category: 'Android & Mobile',
    icon: <Smartphone size={15} />,
    accentColor: '#a855f7'
  },
  {
    name: 'HTML, CSS & JavaScript',
    category: 'Frontend Core',
    icon: <Globe size={15} />,
    accentColor: '#eab308'
  }
];

interface AboutSectionProps {
  onExploreProjects?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onExploreProjects: _onExploreProjects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(SKILLS_DATA.length / ITEMS_PER_PAGE);

  const currentSkills = SKILLS_DATA.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="about-dossier-section" id="about">
      <div className="about-dossier-wrapper">

        {/* Section Header / Archival Meta */}
        <div className="about-section-top">
          <div className="about-section-tag">
            <span>DOSSIER // 01</span>
            <span className="about-section-tag-divider">—</span>
            <span>PROFILE &amp; TECHNICAL PHILOSOPHY</span>
          </div>

        </div>

        {/* Main Editorial Grid */}
        <div className="about-dossier-grid">

          {/* Left Column: Profile, Institution & Background Narrative */}
          <div className="about-left-col">
            <h2 className="about-heading-serif">
              Now, the human part.
            </h2>
            <div className="about-narrative-block">
              <p className="about-narrative-p">
                I'm a Computer Science student at Hochschule Campus Wien, building the layer where AI reasoning meets physical and backend systems.
              </p>
              <p className="about-narrative-p">
                My work spans four areas: multi-agent orchestration (tool-routing architectures that cut latency 30x and token usage by 83% in a 20+ tool agent), model training and fine-tuning (fine-tuned CNN architectures to 96%+ validation accuracy, with Grad-CAM interpretability to verify what the model actually learned), production backend systems (async FastAPI, RAG pipelines with hybrid search and reranking, PostgreSQL-backed state), and applied robotics (real-time vision with YOLOv8, low-latency video pipelines for a search-and-rescue robot). I also build the frontends that make these systems usable.
              </p>
              <p className="about-narrative-p">
                I care about the parts most people skip: sub-second reliability, clean state management, and interfaces that actually feel good to use.
              </p>
            </div>

            {/* Direct Contact Action Row */}
            <div className="about-actions-row">
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
                href="https://www.linkedin.com/in/mkashefirad/"
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
              <div className="about-matrix-title">
                <Code2 size={15} />
                <span>SKILLS</span>
              </div>
              <span className="about-matrix-count">
                [{currentSkills.length} OF {SKILLS_DATA.length}]
              </span>
            </div>

            <div className="about-skills-grid">
              {currentSkills.map((skill, index) => (
                <SteamCard3D
                  key={`${currentPage}-${index}`}
                  name={skill.name}
                  category={skill.category}
                  icon={skill.icon}
                  maxTilt={13}
                  scaleHover={1.035}
                />
              ))}
            </div>

            {/* Skills Pagination Controls: Minimalist Typographic Line Index */}
            <div className="about-skills-pagination" aria-label="Skills pagination">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="about-page-nav-btn"
                aria-label="Previous page"
              >
                <ChevronLeft size={13} />
              </button>

              <div className="about-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <React.Fragment key={pageNum}>
                    {pageNum > 1 && <span className="about-page-divider">/</span>}
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`about-page-num-btn ${currentPage === pageNum ? 'about-page-num-btn--active' : ''}`}
                      aria-label={`Page ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {String(pageNum).padStart(2, '0')}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="about-page-nav-btn"
                aria-label="Next page"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
