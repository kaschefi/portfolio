import React from 'react';
import { STUDENT_PROFILE } from '../data/portfolioData';
import { GraduationCap, MapPin, BookMarked, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { sound } from '../utils/audio';

export const AboutTimeline: React.FC = () => {
  const milestones = [
    {
      year: '2026',
      title: 'Autonomous Systems & Advanced 3D Kinematics',
      institution: 'FH Campus Wien',
      desc: 'Spearheaded digital twin simulation for the Sawyer 7-DOF robotic arm and multi-agent autonomous engineering pipelines with headless browser proof verification.'
    },
    {
      year: '2025',
      title: 'Clinical AI & Healthcare Telemetry Architectures',
      institution: 'FH Campus Wien · Applied Research',
      desc: 'Developed HugoMed clinical decision support system utilizing grounded medical RAG and high-speed emergency response real-time dispatch systems.'
    },
    {
      year: '2024 - 2025',
      title: 'Core Software Engineering & Distributed Systems',
      institution: 'FH Campus Wien',
      desc: 'Deep mastery of distributed databases, network security, mathematical modeling, and enterprise design system token architectures.'
    }
  ];

  return (
    <section className="portfolio-section" id="about">
      <div className="section-header">
        <div className="section-eyebrow">
          <GraduationCap size={14} />
          <span>Academic & Research Path</span>
        </div>
        <h2 className="section-title">FH Campus Wien · Creative Engineering</h2>
        <p className="section-deck">
          Bridging foundational computer science theory with tactile, modern user experiences and physical robotics systems.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Profile Card */}
        <div className="project-hero-card" style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              🎓
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>{STUDENT_PROFILE.name}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                {STUDENT_PROFILE.title}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                <MapPin size={13} />
                <span>{STUDENT_PROFILE.location}</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {STUDENT_PROFILE.bio}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <a
              href={`mailto:${STUDENT_PROFILE.email}`}
              className="contact-pill-btn"
              style={{ justifyContent: 'center' }}
              onClick={() => sound.playClick()}
            >
              <Mail size={16} />
              <span>Contact directly via Email</span>
            </a>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a
                href={STUDENT_PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="open-book-btn"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                onClick={() => sound.playClick()}
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>

              <a
                href={STUDENT_PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="open-book-btn"
                style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}
                onClick={() => sound.playClick()}
              >
                <LinkedinIcon size={15} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        {/* Timeline Journey */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookMarked size={18} color="var(--accent-blue)" />
            <span>Academic Milestones & Applied Research</span>
          </h3>

          {milestones.map((m, idx) => (
            <div key={idx} className="chapter-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="roman-tag" style={{ background: 'rgba(56, 132, 255, 0.15)', color: 'var(--accent-blue)', borderColor: 'rgba(56, 132, 255, 0.3)' }}>
                  {m.year}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.institution}</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                {m.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
