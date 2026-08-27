import React, { useState, useRef, useEffect } from 'react';
import { VOLUMES_DATA, STUDENT_PROFILE } from '../data/portfolioData';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { sound } from '../utils/audio';

interface TerminalProps {
  onOpenVolume: (id: string) => void;
}

interface HistoryItem {
  command: string;
  output: string | React.ReactNode;
}

export const InteractiveTerminal: React.FC<TerminalProps> = ({ onOpenVolume }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div>
          <p style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>
            ⚡ FH Campus Wien · Creative Engineering Terminal v2.4
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
            Type <span style={{ color: '#fff', fontWeight: 600 }}>help</span> to list commands or{' '}
            <span style={{ color: '#fff', fontWeight: 600 }}>projects</span> to view all 7 volumes.
          </p>
        </div>
      )
    }
  ]);

  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    sound.playClick();
    const newHistory: HistoryItem = { command: input, output: null };

    if (cmd === 'help') {
      newHistory.output = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p><strong style={{ color: '#fff' }}>projects / ls</strong> - List all 7 bookshelf volumes</p>
          <p><strong style={{ color: '#fff' }}>open &lt;id&gt;</strong> - Jump to 3D volume (e.g. open codex, open antigravity)</p>
          <p><strong style={{ color: '#fff' }}>skills</strong> - Display core engineering stack</p>
          <p><strong style={{ color: '#fff' }}>bio / about</strong> - Profile & FH Campus Wien background</p>
          <p><strong style={{ color: '#fff' }}>contact</strong> - Email & social channels</p>
          <p><strong style={{ color: '#fff' }}>clear</strong> - Clear console output</p>
        </div>
      );
    } else if (cmd === 'ls' || cmd === 'projects') {
      newHistory.output = (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {VOLUMES_DATA.map((v) => (
            <div key={v.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ color: v.accent, fontWeight: 700, width: '30px' }}>{v.roman}.</span>
              <span style={{ color: '#fff', width: '120px' }}>{v.title}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{v.projectDetails.name}</span>
            </div>
          ))}
        </div>
      );
    } else if (cmd.startsWith('open ')) {
      const volId = cmd.replace('open ', '').trim();
      const matched = VOLUMES_DATA.find((v) => v.id === volId || v.title.toLowerCase() === volId);
      if (matched) {
        sound.playSuccess();
        onOpenVolume(matched.id);
        newHistory.output = `Navigating to Volume ${matched.roman}: ${matched.title}...`;
      } else {
        newHistory.output = `Volume "${volId}" not found. Type "projects" for list.`;
      }
    } else if (cmd === 'skills') {
      newHistory.output = (
        <div>
          <p><strong style={{ color: 'var(--accent-blue)' }}>Languages:</strong> {STUDENT_PROFILE.skills.languages.join(', ')}</p>
          <p><strong style={{ color: 'var(--accent-cyan)' }}>3D & Graphics:</strong> {STUDENT_PROFILE.skills.threeD_creative.join(', ')}</p>
          <p><strong style={{ color: 'var(--accent-orange)' }}>AI & Agents:</strong> {STUDENT_PROFILE.skills.ai_autonomous.join(', ')}</p>
          <p><strong style={{ color: 'var(--accent-emerald)' }}>Robotics & Systems:</strong> {STUDENT_PROFILE.skills.systems_robotics.join(', ')}</p>
        </div>
      );
    } else if (cmd === 'about' || cmd === 'bio') {
      newHistory.output = `${STUDENT_PROFILE.name} · ${STUDENT_PROFILE.title} at ${STUDENT_PROFILE.institution} (${STUDENT_PROFILE.location}).`;
    } else if (cmd === 'contact') {
      newHistory.output = `Email: ${STUDENT_PROFILE.email} | GitHub: ${STUDENT_PROFILE.github} | LinkedIn: ${STUDENT_PROFILE.linkedin}`;
    } else if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    } else {
      newHistory.output = `Command not recognized: "${cmd}". Type "help" for available commands.`;
    }

    setHistory((prev) => [...prev, newHistory]);
    setInput('');
  };

  return (
    <section className="portfolio-section" id="terminal">
      <div className="section-header">
        <div className="section-eyebrow">
          <TerminalIcon size={14} />
          <span>Interactive CLI</span>
        </div>
        <h2 className="section-title">Developer Console</h2>
        <p className="section-deck">
          Direct command-line interface to query project architecture records and navigate the 3D studio.
        </p>
      </div>

      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-dot dot-red" />
          <div className="terminal-dot dot-yellow" />
          <div className="terminal-dot dot-green" />
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            bash · m.kashefirad@campus-wien
          </span>
        </div>

        <div className="terminal-body" ref={terminalBodyRef}>
          {history.map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="terminal-prompt">guest@portfolio:~$</span>
                <span style={{ color: '#fff' }}>{item.command}</span>
              </div>
              {item.output && (
                <div style={{ margin: '0.35rem 0 0.85rem 1.5rem', color: 'var(--text-secondary)' }}>
                  {item.output}
                </div>
              )}
            </div>
          ))}

          <form onSubmit={handleCommand} className="terminal-input-line">
            <span className="terminal-prompt">guest@portfolio:~$</span>
            <input
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type help, projects, skills, open codex..."
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Execute Command"
            >
              <CornerDownLeft size={14} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
