import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// CORRECTED PATHS: Start with '/' because the 'public' folder maps to the root URL
const slides = [
  {
    id: 1,
    image: '/images/Cu.png',
    fallbackColor: '#1a2332',
    alt: 'Football stadium at night'
  },
  {
    id: 2,
    image: '/images/GV.png',
    fallbackColor: '#2d1a1a',
    alt: 'Tactical gaming environment'
  },
  {
    id: 3,
    image: '/images/ll.png',
    fallbackColor: '#1a1a2e',
    alt: 'Vibrant city skyline at sunset'
  },
  {
    id: 4,
    image: '/images/race.png',
    fallbackColor: '#2e1a1a',
    alt: 'High speed racing car'
  },
  {
    id: 5,
    image: '/images/football.png',
    fallbackColor: '#1a2e1a',
    alt: 'Exciting football match'
  },
  {
    id: 6,
    image: '/images/combo.png',
    fallbackColor: '#2e2e1a',
    alt: 'Combo gaming action'
  }
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '85vh', 
      minHeight: '500px', 
      overflow: 'hidden', 
      borderRadius: '0 0 16px 16px',
      backgroundColor: '#05070f'
    }}>
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="carousel-slide"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundColor: slide.fallbackColor, // Shows if image fails to load
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: index === currentSlide ? 1 : 0
          }}
          aria-hidden={index !== currentSlide}
        >
          {index === currentSlide && <div className="beam-overlay" />}
        </div>
      ))}

      {/* Radial Dark Overlay for Center Readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, rgba(5, 7, 15, 0.3) 0%, rgba(5, 7, 15, 0.7) 100%)',
        zIndex: 2
      }} />

      {/* Flexbox Centering Container */}
      <div className="hero-content" style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3,
        padding: '0 16px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', width: '100%' }}>
          {/* Tool Name (H1) */}
          <h1 className="text-title neon-text" style={{ marginBottom: '1rem' }}>
            Squard Hub
          </h1>

          {/* Text Details (P) */}
          <p className="text-body" style={{ color: '#e2e8f0', maxWidth: '500px', margin: '0 auto 2.5rem auto' }}>
            Free tools for gamers: stylish names and custom stickers.
          </p>

          {/* Two Premium Tool Cards */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            
            {/* Name Generator Card */}
            <Link to="/names" className="hero-tool-card">
              <div className="hero-tool-icon-bg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7V4h16v3"/>
                  <path d="M9 20h6"/>
                  <path d="M12 4v16"/>
                </svg>
              </div>
              <span className="text-ui" style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
                Name Generator
              </span>
              <svg className="hero-tool-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>

            {/* Sticker Maker Card */}
            <Link to="/stickers" className="hero-tool-card">
              <div className="hero-tool-icon-bg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/>
                  <path d="M14 3v6h6"/>
                  <circle cx="10" cy="13" r="2"/>
                  <path d="m16 15-2-2"/>
                  <path d="m12 17 2-2"/>
                </svg>
              </div>
              <span className="text-ui" style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
                Sticker Maker
              </span>
              <svg className="hero-tool-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>

          </div>

          {/* Slide Indicators */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem', justifyContent: 'center' }}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index === currentSlide ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  padding: 0,
                  minHeight: '8px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}