import { useState, useRef, Suspense } from 'react';
import { themes, Theme } from './themes';

interface NameplateProps {
  name: string;
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function Nameplate({ name, selectedTheme, onThemeChange }: NameplateProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDownload = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1080);
    gradient.addColorStop(0, '#0b0f1a');
    gradient.addColorStop(1, '#151b2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);

    // Draw frame
    ctx.strokeStyle = selectedTheme.accent;
    ctx.lineWidth = 12;
    ctx.shadowColor = selectedTheme.accentGlow;
    ctx.shadowBlur = 40;
    ctx.strokeRect(60, 60, 960, 960);

    // Draw level badge
    ctx.shadowBlur = 0;
    ctx.fillStyle = selectedTheme.badgeColor;
    ctx.beginPath();
    ctx.arc(180, 180, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#0b0f1a';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('99', 180, 180);

    // Draw rank icon (star)
    ctx.fillStyle = selectedTheme.accent;
    ctx.shadowColor = selectedTheme.accentGlow;
    ctx.shadowBlur = 20;
    const starX = 900, starY = 180, starSize = 50;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = starX + Math.cos(angle) * starSize;
      const y = starY + Math.sin(angle) * starSize;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Draw name with Unicode-supporting font stack
    ctx.shadowBlur = 30;
    ctx.shadowColor = selectedTheme.accentGlow;
    ctx.fillStyle = '#f2f4ff';
    ctx.font = 'bold 72px "Segoe UI", "Roboto", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, 540, 540);

    // Draw theme name
    ctx.shadowBlur = 0;
    ctx.fillStyle = selectedTheme.accent;
    ctx.font = '36px Arial';
    ctx.fillText(selectedTheme.name.toUpperCase(), 540, 900);

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `squard-nameplate-${selectedTheme.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Squard Hub Nameplate',
          text: `Check out my name: ${name}`,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      handleDownload();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
      {/* Theme switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {themes.map(theme => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme)}
            className={selectedTheme.id === theme.id ? 'gamer-btn-secondary' : 'gamer-btn'}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '0.9rem',
              opacity: selectedTheme.id === theme.id ? 1 : 0.6,
              transform: selectedTheme.id === theme.id ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            {theme.name}
          </button>
        ))}
      </div>

      {/* Nameplate preview */}
      <div 
        className="gamer-card"
        style={{
          position: 'relative',
          height: '400px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...selectedTheme.frameStyle,
          transition: 'all 0.5s ease'
        }}
      >
        <Suspense fallback={<div style={{ color: 'var(--text-muted)' }}>Loading theme...</div>}>
          <selectedTheme.Background />
        </Suspense>

        {/* Level badge */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: selectedTheme.badgeColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '900',
          fontSize: '1.5rem',
          color: '#0b0f1a',
          boxShadow: `0 0 20px ${selectedTheme.accentGlow}`
        }}>
          99
        </div>

        {/* Rank icon */}
        <svg style={{ position: 'absolute', top: '20px', right: '20px', width: '60px', height: '60px' }} viewBox="0 0 100 100">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon 
            points="50,10 61,39 92,39 67,59 76,90 50,72 24,90 33,59 8,39 39,39" 
            fill={selectedTheme.accent}
            filter="url(#glow)"
          />
        </svg>

        {/* Name display */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          fontSize: '2.5rem',
          fontWeight: '900',
          textAlign: 'center',
          color: '#f2f4ff',
          textShadow: `0 0 20px ${selectedTheme.accentGlow}, 0 0 40px ${selectedTheme.accentGlow}`,
          padding: '0 1rem',
          wordBreak: 'break-word',
          maxWidth: '90%',
          transition: 'all 0.5s ease'
        }}>
          {name || 'Your Name Here'}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={handleDownload} className="gamer-btn" style={{ flex: 1 }}>
          Download Card
        </button>
        <button onClick={handleShare} className="gamer-btn-secondary" style={{ flex: 1 }}>
          Share
        </button>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
        Note: Some decorative Unicode characters may not render on all devices.
      </p>
    </div>
  );
}