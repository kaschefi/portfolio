import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Copy, Check, Mail, ExternalLink, ArrowUpRight } from 'lucide-react';

interface EmailPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export const EmailPickerModal: React.FC<EmailPickerModalProps> = ({
  isOpen,
  onClose,
  email = 'mohammad.kashefirad@stud.hcw.ac.at'
}) => {
  const [copied, setCopied] = useState(false);
  const addressCardRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);

  const [addressTilt, setAddressTilt] = useState<{
    transform: string;
    glareX: number;
    glareY: number;
    glareOpacity: number;
    glareAngle: number;
    shadowX: number;
    shadowY: number;
    isHovered: boolean;
  }>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    glareAngle: 135,
    shadowX: 0,
    shadowY: 4,
    isHovered: false
  });

  const handleAddressMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!addressCardRef.current) return;
    const rect = addressCardRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    rafId.current = requestAnimationFrame(() => {
      const width = rect.width;
      const height = rect.height;

      // Normalized offsets from center (-1 to +1)
      const percentX = (clientX / width) * 2 - 1;
      const percentY = (clientY / height) * 2 - 1;

      const maxTilt = 8;
      const scaleHover = 1.025;

      // 3D Rotations
      const rotateX = -percentY * maxTilt;
      const rotateY = percentX * maxTilt;

      // Glare coordinates & angle
      const glareX = (clientX / width) * 100;
      const glareY = (clientY / height) * 100;
      const glareAngle = Math.atan2(clientY - height / 2, clientX - width / 2) * (180 / Math.PI) + 90;

      // Distance from center for dynamic glare brightness
      const distanceFromCenter = Math.min(Math.sqrt(percentX * percentX + percentY * percentY), 1.2);
      const glareOpacity = Math.min(0.18 + distanceFromCenter * 0.45, 0.7);

      // Counter-directional elevation shadow
      const shadowX = -percentX * 14;
      const shadowY = -percentY * 14 + 10;

      setAddressTilt({
        transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scaleHover}, ${scaleHover}, 1)`,
        glareX,
        glareY,
        glareOpacity,
        glareAngle,
        shadowX,
        shadowY,
        isHovered: true
      });
    });
  }, []);

  const handleAddressMouseLeave = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }
    setAddressTilt({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
      glareAngle: 135,
      shadowX: 0,
      shadowY: 4,
      isHovered: false
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const subject = encodeURIComponent("Hello Mohammad — Let's connect");
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${subject}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(email)}&subject=${subject}`;
  const defaultMailUrl = `mailto:${email}?subject=${subject}`;

  return (
    <div className="email-picker-backdrop" onClick={onClose}>
      <div 
        className="email-picker-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-picker-title"
      >
        {/* Header Bar */}
        <div className="email-picker-header">
          <div className="email-picker-meta">
            <span className="email-picker-tag">DIRECT TRANSMISSION</span>
            <span className="email-picker-divider">•</span>
            <span className="email-picker-tag-sub">WEBMAIL & CLIENT PICKER</span>
          </div>
          <button 
            className="email-picker-close-btn"
            onClick={onClose}
            aria-label="Close Email Modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Content Body */}
        <div className="email-picker-body">
          <div className="email-picker-intro">
            <h3 id="email-picker-title" className="email-picker-title">
              Let's start a conversation.
            </h3>
            <p className="email-picker-desc">
              Choose your preferred webmail service, open your desktop mail client, or copy the address.
            </p>
          </div>

          {/* Quick Copy Field - SteamCard3D Physical Tilt */}
          <div className="email-picker-address-container">
            <div 
              ref={addressCardRef}
              className="email-picker-address-card steam-card-address"
              onMouseMove={handleAddressMouseMove}
              onMouseLeave={handleAddressMouseLeave}
              style={{
                transform: addressTilt.transform,
                boxShadow: addressTilt.isHovered
                  ? `${addressTilt.shadowX.toFixed(1)}px ${addressTilt.shadowY.toFixed(1)}px 28px -2px rgba(0, 0, 0, 0.7), 0 0 18px -2px rgba(255, 255, 255, 0.06)`
                  : '0 4px 16px rgba(0, 0, 0, 0.4)',
                borderColor: addressTilt.isHovered ? 'rgba(244, 238, 230, 0.25)' : 'rgba(244, 238, 230, 0.1)',
                transition: addressTilt.isHovered
                  ? 'box-shadow 0.1s ease-out, border-color 0.2s ease-out'
                  : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease-out, border-color 0.3s ease-out'
              }}
            >
              {/* Holographic Foil Sheen Layer */}
              <div
                className="steam-card-holo-layer"
                style={{
                  opacity: addressTilt.isHovered ? 0.34 : 0,
                  background: `linear-gradient(
                    ${addressTilt.glareAngle.toFixed(1)}deg,
                    rgba(255, 0, 128, 0) 0%,
                    rgba(0, 210, 255, 0.16) 25%,
                    rgba(255, 230, 0, 0.18) 50%,
                    rgba(16, 185, 129, 0.16) 75%,
                    rgba(255, 0, 128, 0) 100%
                  )`,
                  transition: addressTilt.isHovered ? 'opacity 0.2s ease-out' : 'opacity 0.4s ease-out'
                }}
              />

              {/* Dynamic Light Glare Reflection Layer */}
              <div
                className="steam-card-glare-layer"
                style={{
                  opacity: addressTilt.glareOpacity,
                  background: `radial-gradient(
                    circle at ${addressTilt.glareX.toFixed(1)}% ${addressTilt.glareY.toFixed(1)}%,
                    rgba(255, 255, 255, 0.65) 0%,
                    rgba(255, 255, 255, 0.2) 28%,
                    rgba(255, 255, 255, 0) 65%
                  )`,
                  transition: addressTilt.isHovered ? 'opacity 0.15s ease-out' : 'opacity 0.4s ease-out'
                }}
              />

              {/* Corner Reticle */}
              <div className="steam-card-reticle" />

              <div className="email-picker-address-left">
                <span className="email-picker-label">RECIPIENT ADDRESS</span>
                <span className="email-picker-email-text">{email}</span>
              </div>
              <button 
                onClick={handleCopy}
                className={`email-picker-copy-btn ${copied ? 'email-picker-copy-btn--copied' : ''}`}
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Options Grid */}
          <div className="email-picker-options-grid">
            {/* 1. Gmail */}
            <a 
              href={gmailUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="email-picker-option-card"
              onClick={onClose}
            >
              <div className="email-picker-option-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <div className="email-picker-option-content">
                <div className="email-picker-option-title-row">
                  <span className="email-picker-option-title">Gmail</span>
                  <ArrowUpRight size={14} className="email-picker-arrow" />
                </div>
                <span className="email-picker-option-sub">Google Webmail</span>
              </div>
            </a>

            {/* 2. Outlook / Hotmail */}
            <a 
              href={outlookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="email-picker-option-card"
              onClick={onClose}
            >
              <div className="email-picker-option-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 6.5l-10 6.5-10-6.5V19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6.5zM12 11L2 4.5C2.3 3.6 3.1 3 4 3h16c.9 0 1.7.6 2 1.5L12 11z" />
                </svg>
              </div>
              <div className="email-picker-option-content">
                <div className="email-picker-option-title-row">
                  <span className="email-picker-option-title">Outlook</span>
                  <ArrowUpRight size={14} className="email-picker-arrow" />
                </div>
                <span className="email-picker-option-sub">Microsoft Webmail</span>
              </div>
            </a>

            {/* 3. Default Native Mail App */}
            <a 
              href={defaultMailUrl}
              className="email-picker-option-card"
              onClick={onClose}
            >
              <div className="email-picker-option-icon">
                <Mail size={18} />
              </div>
              <div className="email-picker-option-content">
                <div className="email-picker-option-title-row">
                  <span className="email-picker-option-title">Default Client</span>
                  <ExternalLink size={13} className="email-picker-arrow" />
                </div>
                <span className="email-picker-option-sub">Apple Mail, Desktop</span>
              </div>
            </a>

            {/* 4. Instant Clipboard Copy */}
            <button 
              onClick={handleCopy}
              className="email-picker-option-card email-picker-option-card--copy"
            >
              <div className="email-picker-option-icon">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </div>
              <div className="email-picker-option-content">
                <div className="email-picker-option-title-row">
                  <span className="email-picker-option-title">{copied ? 'Copied!' : 'Copy Email'}</span>
                  <span className="email-picker-badge-key">1-CLICK</span>
                </div>
                <span className="email-picker-option-sub">Save to clipboard</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
