import { useEffect, useState } from 'react';

export default function BackgroundCityLife() {
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
      {/* Sunset gradient sky */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, #6b46c1 0%, #ffb347 100%)'
      }}/>

      {/* Layered skyline silhouettes with parallax */}
      <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60%' }} viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">
        {/* Far layer */}
        <g style={{ animation: isVisible ? 'parallaxFar 20s ease-in-out infinite' : 'none' }}>
          <path d="M 0 150 L 50 120 L 80 130 L 120 100 L 160 110 L 200 90 L 240 100 L 280 110 L 320 95 L 360 105 L 400 115 L 400 200 L 0 200 Z" 
                fill="rgba(107, 70, 193, 0.4)"/>
        </g>
        {/* Mid layer */}
        <g style={{ animation: isVisible ? 'parallaxMid 15s ease-in-out infinite' : 'none' }}>
          <path d="M 0 170 L 40 150 L 70 160 L 100 140 L 140 150 L 180 130 L 220 140 L 260 135 L 300 145 L 340 140 L 380 150 L 400 155 L 400 200 L 0 200 Z" 
                fill="rgba(107, 70, 193, 0.6)"/>
        </g>
        {/* Near layer */}
        <g style={{ animation: isVisible ? 'parallaxNear 10s ease-in-out infinite' : 'none' }}>
          <path d="M 0 185 L 30 175 L 60 180 L 90 170 L 130 175 L 170 165 L 210 170 L 250 168 L 290 172 L 330 170 L 370 175 L 400 180 L 400 200 L 0 200 Z" 
                fill="rgba(107, 70, 193, 0.8)"/>
        </g>
      </svg>

      <style>{`
        @keyframes parallaxFar {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
        @keyframes parallaxMid {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }
        @keyframes parallaxNear {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-30px); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}