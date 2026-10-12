import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const sampleNames = [
  { name: '꧁⚔️︎︎𝕭𝖑𝖆𝖈𝖐𝕺𝖙☠︎︎⚔️꧂', theme: 'Battle Royale' },
  { name: '⚡𝕍𝕟𝕠𝕞_𝕊𝕥Strike⚡', theme: 'Battle Royale' },
  { name: '乂✰𝕯𝖆𝖐𝖓𝖊𝖘✰乂', theme: 'Battle Royale' },
  { name: '𝔾𝕠𝕒𝕝𝕄𝕒𝕙𝕚𝕟⚽', theme: 'Football Night' },
  { name: '👑𝓥𝓘𝓟_ striker👑', theme: 'Football Night' },
  { name: '⚡𝕱𝖆𝖙_𝕱𝖔𝖔𝖙⚡', theme: 'Football Night' },
  { name: '𝕰𝖌𝖇𝖓_𝕮𝖘𝖍💰', theme: 'City Life' },
  { name: '👑𝕺𝖇𝖆_𝕺𝖋_𝕷𝖌𝖔𝖘', theme: 'City Life' },
  { name: '🚗𝕲𝖆𝖌𝖜𝖑𝖆𝖉𝖆_𝕽𝖎𝖉𝖊𝖗', theme: 'City Life' },
  { name: '☣️𝕿𝖔𝖝𝖎𝖈_𝕭𝖔𝖘☣️', theme: 'Battle Royale' },
  { name: '⚽𝕸𝖆𝖊𝖘𝖙𝖗𝖔_𝕯𝕾⚽', theme: 'Football Night' },
  { name: '🌟𝕷𝖊𝖐𝖐𝖎_𝕾𝖙𝖗✨', theme: 'City Life' },
];

export function NameWall() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div style={{ marginTop: '3rem', overflow: 'hidden' }}>
      <h2 className="text-header neon-text-secondary" style={{ fontSize: '18px', textAlign: 'center', marginBottom: '1.5rem' }}>
        Sample Names
      </h2>
      
      <div 
        className="marquee-container"
        style={{
          display: 'flex',
          animation: isVisible ? 'marqueeScroll 30s linear infinite' : 'none',
          width: 'fit-content'
        }}
      >
        {/* Duplicate for seamless loop */}
        {[...sampleNames, ...sampleNames].map((item, index) => (
          <Link
            key={index}
            to={`/names?q=${encodeURIComponent(item.name)}`}
            className="gamer-card"
            style={{
              padding: '0.75rem 1.5rem',
              margin: '0 0.5rem',
              whiteSpace: 'nowrap',
              fontSize: '13px',
              fontWeight: '700',
              flexShrink: 0,
              textDecoration: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* 
        TODO: Connect to real user database
        Replace sampleNames with data from your backend API
        Example: const userNames = await fetch('/api/top-names').then(r => r.json());
      */}

      <style>{`
        .marquee-container:hover {
          animation-play-state: paused !important;
        }
        .marquee-container a:hover {
          border-color: var(--accent-secondary);
          box-shadow: 0 0 15px rgba(0, 224, 184, 0.3);
          transform: translateY(-2px);
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-container {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}