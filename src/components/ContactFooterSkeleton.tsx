import React from 'react';

export const ContactFooterSkeleton: React.FC = () => {
  return (
    <footer className="contact-footer-section" id="contact" aria-label="Loading Contact Section" style={{ minHeight: '300px', opacity: 0.6 }}>
      <div className="contact-footer-wrapper">
        <div className="contact-callout-card" style={{ minHeight: '200px' }} />
      </div>
    </footer>
  );
};
