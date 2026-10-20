import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

const slides = [
  { id: 1, image: '/images/Cu.png', fallbackColor: '#1a2332' },
  { id: 2, image: '/images/GV.png', fallbackColor: '#2d1a1a' },
  { id: 3, image: '/images/ll.png', fallbackColor: '#1a1a2e' },
  { id: 4, image: '/images/race.png', fallbackColor: '#2e1a1a' },
  { id: 5, image: '/images/football.png', fallbackColor: '#1a2e1a' },
  { id: 6, image: '/images/combo.png', fallbackColor: '#2e2e1a' },
];

export function AuthSplitScreen() {
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    playClick();

    try {
      if (isLogin) {
        await signIn(email, password);
        playSuccess();
      } else {
        if (!username.trim()) throw new Error('Username is required');
        await signUp(email, password, username.trim());
        playSuccess();
      }
    } catch (err: any) {
      playError();
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      
      {/* 1. CAROUSEL SECTION (Shows on top for Mobile, Left for Desktop) */}
      <div className="auth-carousel-section">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${slide.image})`,
              backgroundColor: slide.fallbackColor,
              backgroundSize: 'cover', backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
        ))}
        {/* Dark gradient overlay to make text readable on mobile */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15, 19, 24, 1) 0%, rgba(15, 19, 24, 0.4) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'
        }}>
          <h1 className="logo-text" style={{ fontSize: '24px', color: '#fff', marginBottom: '8px' }}>
            SQUARD HUB
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', maxWidth: '400px', lineHeight: '1.5', display: 'none' }}>
            {/* Hidden on mobile to save space, shown on desktop via media query if needed, but keeping it clean for now */}
          </p>
        </div>
      </div>

      {/* 2. FORM SECTION (Shows on bottom for Mobile, Right for Desktop) */}
      <div className="auth-form-section">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-secondary">
              {isLogin ? 'Enter your details to access your account.' : 'Get started with your free account today.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {!isLogin && (
              <div>
                <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="input" placeholder="Choose a username" required />
              </div>
            )}
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="name@example.com" required />
            </div>
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" required minLength={6} />
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#EF4444', fontSize: '14px', margin: 0, fontWeight: '500' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-secondary" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); playClick(); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, font: 'inherit', fontWeight: '600', textDecoration: 'underline' }}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}