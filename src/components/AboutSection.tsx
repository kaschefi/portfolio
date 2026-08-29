import React from 'react';
import { 
  GraduationCap, 
  Layers, 
  Mail, 
  ArrowUpRight, 
  ExternalLink, 
  ArrowDown, 
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
  Globe
} from 'lucide-react';

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
              <Code2 size={15} />
              <span>RESONANT SKILLS MATRIX</span>
            </div>

            <div className="about-skills-grid">
              {SKILLS_DATA.map((skill, index) => (
                <div key={index} className="about-skill-card">
                  <div className="about-skill-card-top">
                    <span className="about-skill-icon">{skill.icon}</span>
                    <span className="about-skill-category">{skill.category}</span>
                  </div>
                  <span className="about-skill-name">{skill.name}</span>
                </div>
              ))}
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
