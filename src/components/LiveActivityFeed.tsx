import { useEffect, useState } from 'react';

const fakeActivities = [
  { user: 'LagosSlayer', action: 'copied', name: '⚔️𝕯𝖆𝖗𝖐𝖓𝖎𝖍𝖙⚔️꧂' },
  { user: 'AbujaKing', action: 'unlocked', name: 'Golden Crown Style 👑' },
  { user: 'SapaSlayer99', action: 'copied', name: '⚡𝕖𝕟𝕠_𝕊𝕥Strike⚡' },
  { user: 'JapaBoy', action: 'saved', name: '𝕰𝖌𝖇𝖔𝖓_𝕮𝖆𝖘𝖍💰' },
  { user: 'FreeFirePro', action: 'spun Mystery Box', name: 'and got Pro Status! ★' },
  { user: 'DLS_Master', action: 'copied', name: '🏆𝔾𝕒𝕝𝕄𝕒𝕔𝕙𝕟𝕖' },
  { user: 'LekkiVibes', action: 'copied', name: '🚗𝕲𝖜𝖆𝖌𝖆𝖑𝖆𝖉𝖆_𝕽𝖎𝖉𝖊𝖗' },
  { user: 'NaijaGamer', action: 'upgraded to', name: 'Verified Pro ★' },
];

export function LiveActivityFeed() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // Duplicate for seamless loop
  const items = [...fakeActivities, ...fakeActivities];

  return (
    <div style={{ 
      background: 'rgba(5, 7, 15, 0.8)', 
      borderBottom: '1px solid rgba(124, 92, 255, 0.2)', 
      padding: '0.5rem 0', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div 
        style={{
          display: 'flex',
          gap: '3rem',
          animation: isVisible ? 'feedScroll 40s linear infinite' : 'none',
          width: 'fit-content'
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="text-caption" style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--accent-secondary)', fontWeight: '700' }}>🔥 @{item.user}</span>
            <span style={{ color: 'var(--text-muted)' }}>{item.action}</span>
            <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{item.name}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes feedScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}