import { useEffect, useState } from 'react';

export default function BackgroundBattleRoyale() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Topographic contour lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="contour" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 0 50 Q 25 30, 50 50 T 100 50" fill="none" stroke="#2d5a2d" strokeWidth="1"/>
            <path d="M 0 70 Q 25 50, 50 70 T 100 70" fill="none" stroke="#2d5a2d" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#contour)"/>
      </svg>

      {/* Radar circle with sweep animation */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '300px',
        height: '300px',
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        border: '2px solid rgba(45, 90, 45, 0.4)',
        animation: isVisible ? 'radarSweep 4s linear infinite' : 'none'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 107, 53, 0.3) 60deg, transparent 60deg)',
          animation: isVisible ? 'radarRotate 4s linear infinite' : 'none'
        }}/>
      </div>

      {/* Drifting particles */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 107, 53, 0.6)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: isVisible ? `particleFloat ${3 + Math.random() * 2}s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}

      <style>{`
        @keyframes radarSweep {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
        }
        @keyframes radarRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.6; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}