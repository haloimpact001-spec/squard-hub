import { useEffect, useState } from 'react';

export default function BackgroundFootballNight() {
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
      {/* Pitch lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
        <rect width="100%" height="100%" fill="#0a4d0a"/>
        <line x1="200" y1="0" x2="200" y2="400" stroke="rgba(255, 244, 163, 0.3)" strokeWidth="2"/>
        <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255, 244, 163, 0.3)" strokeWidth="2"/>
        <circle cx="200" cy="200" r="4" fill="rgba(255, 244, 163, 0.5)"/>
      </svg>

      {/* Stadium light glows */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        left: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 244, 163, 0.4) 0%, transparent 70%)',
        filter: 'blur(20px)'
      }}/>
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 244, 163, 0.4) 0%, transparent 70%)',
        filter: 'blur(20px)'
      }}/>

      {/* Grass gradient floor */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
        background: 'linear-gradient(to top, rgba(10, 77, 10, 0.8) 0%, transparent 100%)'
      }}/>

      {/* Floating light dust */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 244, 163, 0.5)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: isVisible ? `dustFloat ${4 + Math.random() * 3}s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.4}s`
          }}
        />
      ))}

      <style>{`
        @keyframes dustFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.5; }
          50% { transform: translateY(-30px) translateX(15px); opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}