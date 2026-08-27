import React from 'react';
import { STUDENT_PROFILE } from '../data/portfolioData';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { sound } from '../utils/audio';

export const Footer: React.FC = () => {
  return (
    <footer className="portfolio-footer">
      <div className="footer-inner">
        <div>
          <p style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>
            {STUDENT_PROFILE.name} · FH Campus Wien
          </p>
          <p className="footer-copy">
            Built with Three.js r165, ThreeUI BookshelfScene & React · Vienna, Austria
          </p>
        </div>

        <div className="footer-links">
          <a
            href={STUDENT_PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
            aria-label="GitHub"
            onClick={() => sound.playClick()}
          >
            <GithubIcon size={16} />
          </a>
          <a
            href={STUDENT_PROFILE.linkedin}
            target="_blank"
            rel="noreferrer"
            className="footer-link"
            aria-label="LinkedIn"
            onClick={() => sound.playClick()}
          >
            <LinkedinIcon size={16} />
          </a>
          <a
            href={`mailto:${STUDENT_PROFILE.email}`}
            className="footer-link"
            aria-label="Email"
            onClick={() => sound.playClick()}
          >
            <Mail size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
};
