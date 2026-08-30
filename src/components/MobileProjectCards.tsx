import React, { useState } from 'react';
import { BookOpen, ArrowUpRight } from 'lucide-react';
import { VOLUMES_DATA, type VolumeProject } from '../data/portfolioData';
import { GithubIcon } from './Icons';
import { sound } from '../utils/audio';

interface MobileProjectCardsProps {
    onSelectVolume: (volume: VolumeProject) => void;
}

const CATEGORIES = [
    { id: 'all', label: 'All Volumes' },
    { id: 'Autonomous Robotics & Agentic Systems', label: 'Robotics & AI' },
    { id: 'Autonomous Robotics & Visual Servoing', label: 'Vision & Cobots' },
    { id: 'Distributed Systems & Vector Computing', label: 'Distributed Systems' },
    { id: 'Graph Algorithms & Simulation', label: 'Algorithms' },
    { id: 'Computer Vision & Deep Learning', label: 'Deep Learning' },
    { id: 'Full-Stack Web Systems & Distributed Application Architecture', label: 'Web Systems' }
];

export const MobileProjectCards: React.FC<MobileProjectCardsProps> = ({ onSelectVolume }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const filteredVolumes = selectedCategory === 'all'
        ? VOLUMES_DATA
        : VOLUMES_DATA.filter((v) => v.projectDetails.category === selectedCategory);

    const handleSelect = (volume: VolumeProject) => {
        sound.playBookOpen();
        onSelectVolume(volume);
    };

    const handleCategoryClick = (catId: string) => {
        sound.playClick();
        setSelectedCategory(catId);
    };

    const handleSourceClick = (e: React.MouseEvent, url?: string) => {
        e.stopPropagation();
        if (url) {
            sound.playClick();
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <main className="mobile-projects-section" id="bookshelf">
            <div className="mobile-projects-wrapper">
                {/* Archival Section Tag Header matching About Dossier */}
                <div className="mobile-projects-header">
                    <div className="about-section-tag">
                        <span>DOSSIER // 02</span>
                        <span className="about-section-tag-divider">—</span>
                        <span>RESEARCH VOLUMES &amp; MONOGRAPHS</span>
                        <span className="about-section-tag-divider">·</span>
                        <span className="mobile-count-tag">[{filteredVolumes.length} OF {VOLUMES_DATA.length}]</span>
                    </div>

                    <h2 className="about-heading-serif mobile-dossier-heading">
                        Volumes &amp; Monographs.
                    </h2>

                    <p className="about-narrative-p mobile-dossier-narrative">
                        Six engineering treatises spanning autonomous agent architectures, robotics kinematics, multi-modal ingestion pipelines, and deep learning computer vision.
                    </p>

                    {/* Category Filter Navigation Pills */}
                    <div className="mobile-filter-wrapper">
                        <div className="mobile-filter-row" role="tablist" aria-label="Filter volumes by discipline">
                            {CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        className={`mobile-filter-pill ${isActive ? 'mobile-filter-pill--active' : ''}`}
                                        onClick={() => handleCategoryClick(cat.id)}
                                    >
                                        {cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Project Cards (Skill Card Styling: rgba(14, 18, 28, 0.65), 10px radius, clean ink borders) */}
                <div className="mobile-projects-list">
                    {filteredVolumes.map((volume) => {
                        const topMetrics = volume.projectDetails.keyMetrics.slice(0, 2);
                        const topTech = volume.projectDetails.techStack.slice(0, 4);

                        return (
                            <article
                                key={volume.id}
                                className="mobile-skill-styled-card"
                                onClick={() => handleSelect(volume)}
                                tabIndex={0}
                                role="button"
                                aria-label={`${volume.title} - ${volume.discipline}`}
                            >
                                {/* Card Body styled identical to .steam-card-body */}
                                <div className="mobile-card-body-inner">
                                    {/* Top Row: Roman Tag + Category & Timeframe */}
                                    <div className="mobile-card-top-row">
                                        <div className="mobile-card-tag-group">
                                            <span className="mobile-roman-badge">
                                                VOL. {volume.roman}
                                            </span>
                                            <span className="mobile-category-badge">
                                                {volume.discipline}
                                            </span>
                                        </div>
                                        <span className="mobile-time-badge">
                                            {volume.projectDetails.timeframe}
                                        </span>
                                    </div>

                                    {/* Title & Subtitle */}
                                    <div className="mobile-card-title-group">
                                        <h3 className="mobile-card-title">{volume.title}</h3>
                                        <p className="mobile-card-subtitle">{volume.subtitle}</p>
                                    </div>

                                    {/* Narrative Note */}
                                    <p className="mobile-card-note">{volume.note || volume.deck}</p>

                                    {/* Key Metrics Mini-Grid */}
                                    {topMetrics.length > 0 && (
                                        <div className="mobile-card-metrics-strip">
                                            {topMetrics.map((metric, idx) => (
                                                <div key={idx} className="mobile-metric-cell">
                                                    <span className="mobile-metric-value">{metric.value}</span>
                                                    <span className="mobile-metric-label">{metric.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Tech Stack Pills */}
                                    {topTech.length > 0 && (
                                        <div className="mobile-card-tech-cloud">
                                            {topTech.map((tech) => (
                                                <span key={tech} className="mobile-card-tech-pill">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Card Action Footer */}
                                    <div className="mobile-card-bottom-bar">
                                        <div className="mobile-card-cta-btn">
                                            <BookOpen size={13} className="mobile-cta-icon" />
                                            <span>Read Case Study</span>
                                        </div>

                                        <div className="mobile-card-actions">
                                            {volume.projectDetails.githubUrl && (
                                                <button
                                                    type="button"
                                                    className="mobile-card-github-btn"
                                                    onClick={(e) => handleSourceClick(e, volume.projectDetails.githubUrl)}
                                                    aria-label={`View ${volume.title} repository`}
                                                >
                                                    <GithubIcon size={12} />
                                                    <span>Source</span>
                                                </button>
                                            )}
                                            <div className="mobile-card-arrow" aria-hidden="true">
                                                <ArrowUpRight size={14} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reticle Corner Accent */}
                                    <div className="mobile-card-reticle" aria-hidden="true" />
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default MobileProjectCards;


