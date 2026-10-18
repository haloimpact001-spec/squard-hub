import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/useUIStore';

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

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (!username.trim()) throw new Error('Username is required');
        await signUp(email, password, username.trim());
        alert('Account created! Please check your email to verify your account if required.');
      }
      setAuthOpen(false);
      // Reset form
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(5, 7, 15, 0.95)',
        backdropFilter: 'blur(12px)', zIndex: 1002,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={() => setAuthOpen(false)}
    >
      <div 
        className="gamer-card"
        style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => setAuthOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem', minHeight: 'auto', padding: '0.25rem' }}>✕</button>

        <h2 className="text-title neon-text" style={{ fontSize: '20px', marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLogin ? 'Enter the Arena' : 'Join the Squad'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a Username"
              className="sidebar-input"
              required
            />
          )}
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="Email Address"
            className="sidebar-input"
            required
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="sidebar-input"
            required
            minLength={6}
          />

          {error && <p style={{ color: '#ff4d4d', fontSize: '12px', textAlign: 'center', margin: 0 }}>{error}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="gamer-btn-secondary"
            style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="text-caption" style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', padding: 0, font: 'inherit', textDecoration: 'underline' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}