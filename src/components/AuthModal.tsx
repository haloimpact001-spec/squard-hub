import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/useUIStore';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

export function AuthModal() {
  const { isAuthOpen, setAuthOpen } = useUIStore();
  const { signIn, signUp } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

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
      setAuthOpen(false);
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (err: any) {
      playError();
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, 
        backgroundColor: 'rgba(11, 13, 20, 0.7)', 
        backdropFilter: 'blur(12px)', 
        zIndex: 1002,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={() => { setAuthOpen(false); playClick(); }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '650px',
          background: 'rgba(22, 26, 40, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* LEFT: App Icon / Game Icon */}
        <div style={{ 
          width: '160px', 
          background: 'linear-gradient(145deg, #6366F1 0%, #4338CA 100%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '12px',
          padding: '1.5rem',
          position: 'relative',
          flexShrink: 0
        }}>
          {/* Decorative glow */}
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
          
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: '900', color: '#fff',
            fontFamily: 'Orbitron, sans-serif',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}>
            S
          </div>
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: '800', letterSpacing: '2px', textAlign: 'center', fontFamily: 'Orbitron, sans-serif' }}>
            SQUARD
          </span>
        </div>

        {/* RIGHT: Sign In / Sign Up Features */}
        <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="text-title" style={{ fontSize: '20px', color: 'var(--text-primary)', margin: 0 }}>
              {isLogin ? 'Welcome Back' : 'Join the Squad'}
            </h2>
            <button 
              onClick={() => { setAuthOpen(false); playClick(); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px', padding: '4px', lineHeight: 1 }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a Username"
                className="premium-input"
                required
              />
            )}
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              className="premium-input"
              required
            />
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="premium-input"
              required
              minLength={6}
            />

            {error && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '0.5rem' }}>
                <p style={{ color: '#ef4444', fontSize: '12px', textAlign: 'center', margin: 0, fontWeight: '600' }}>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%', marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-caption" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); playClick(); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline', fontWeight: '700' }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}