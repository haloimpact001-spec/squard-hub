import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useUIStore } from '../store/useUIStore';
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
  const { setAuthOpen } = useUIStore();
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
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
        playSuccess();
        setAuthOpen(false);
      } else {
        if (!username.trim()) throw new Error('Username is required');

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: { data: { username: username.trim() } },
        });

        if (error) throw error;
        playSuccess();
        alert('Account created! Please check your email to verify, then sign in.');
        setIsLogin(true);
        setEmail(''); setPassword(''); setUsername('');
      }
    } catch (err: any) {
      playError();
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = async () => {
    playClick();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: window.location.origin, // Returns user to your app after login
      },
    });
    if (error) {
      playError();
      setError(error.message);
    }
  };

  return (
    <div className="auth-layout">
      {/* 1. CAROUSEL SECTION */}
      <div className="auth-carousel-section">
        {slides.map((slide, index) => (
          <div key={slide.id} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${slide.image})`,
            backgroundColor: slide.fallbackColor,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }} />
        ))}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15, 19, 24, 1) 0%, rgba(15, 19, 24, 0.4) 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px'
        }}>
          <h1 className="logo-text" style={{ fontSize: '24px', color: '#fff', marginBottom: '8px' }}>SQUARD HUB</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px' }}>The ultimate platform for gamers</p>
        </div>
      </div>

      {/* 2. FORM SECTION */}
      <div className="auth-form-section">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-secondary">
              {isLogin ? 'Sign in to continue to Squard Hub' : 'Join the ultimate gaming community'}
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
              <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input" placeholder="your@email.com" required />
            </div>
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input" placeholder="••••••••" minLength={6} required />
            </div>

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ color: '#EF4444', fontSize: '14px', margin: 0, fontWeight: '500' }}>{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {/* DISCORD DIVIDER & BUTTON */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span className="text-secondary" style={{ fontSize: '12px', fontWeight: '600' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          <button 
            type="button" 
            onClick={handleDiscordLogin}
            className="btn btn-secondary"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid var(--border-subtle)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Discord
          </button>

          <p className="text-secondary" style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); playClick(); }} 
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, font: 'inherit', fontWeight: '600', textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}