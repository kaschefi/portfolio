import React, { useState } from 'react';
import { Mail, Check, Copy, ArrowUpRight, Sparkles } from 'lucide-react';

interface ContactFooterProps {
  onOpenEmail?: () => void;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ onOpenEmail }) => {
  const [copied, setCopied] = useState(false);
  const email = 'mohammad.kashefirad@stud.hcw.ac.at';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      window.location.href = `mailto:${email}`;
    }
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="contact-footer-section" id="contact">
      <div className="contact-footer-wrapper">

        {/* Availability & Callout Banner */}



        <div className="contact-callout-card">
          <div className="contact-callout-header">
            <div className="contact-status-pill">
              <span className="contact-status-dot" />
              <span className="contact-status-text">AVAILABLE FOR ROLES & COLLABORATION
              </span>
            </div>
            <span className="contact-meta-year">VIENNA · REMOTE // 2026</span>
          </div>

          <div className="contact-callout-body">
            <div className="contact-callout-main">
              <h2 className="contact-callout-title">
                Let’s build cool things together.
              </h2>
              <p className="contact-callout-subtitle">
                Let's talk about what you're building.
              </p>
            </div>

            {/* Frictionless 1-Click Actions */}
            <div className="contact-actions-cluster">
              <div className="contact-email-box">
                <button
                  type="button"
                  onClick={onOpenEmail || (() => window.location.href = `mailto:${email}`)}
                  className="contact-primary-email-btn"
                  aria-label={`Open email picker for ${email}`}
                >
                  <Mail size={15} className="contact-email-icon" />
                  <span className="contact-email-text">{email}</span>
                  <ArrowUpRight size={14} className="contact-btn-arrow" />
                </button>

                <button
                  onClick={handleCopyEmail}
                  className="contact-copy-btn"
                  aria-label="Copy email address to clipboard"
                  title="Copy email to clipboard"
                  type="button"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="contact-copy-success" />
                      <span className="contact-copy-label">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span className="contact-copy-label">Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="contact-links-row">
                <a
                  href="https://github.com/kaschefi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-network-pill"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <span>GitHub</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/mkashefirad/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-network-pill"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>
          </div>
        </div>




        {/* Colophon & Bottom Bar */}
        <div className="contact-colophon-bar">
          <div className="contact-colophon-left">
            <span className="contact-author">Mohammad Kashefirad</span>
            <span className="contact-colophon-sep">/</span>
            <span className="contact-inst">Hochschule Campus Wien</span>
          </div>

          <div className="contact-colophon-center">
            <span className="contact-shader-badge">
              <Sparkles size={12} />
              <span>Zero-Load WebGL & Eulerian Navier-Stokes Simulation</span>
            </span>
          </div>

          <div className="contact-colophon-right">
            <button
              onClick={handleScrollTop}
              className="contact-back-top-btn"
              aria-label="Back to top of page"
            >
              <span>Back to Top ↑</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
