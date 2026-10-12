import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProfileModal } from './ProfileModal';
import { DailyRewardsModal } from './DailyRewardsModal';
import { LiveActivityFeed } from './LiveActivityFeed';
import { getUserProfile } from '../lib/localStorage';

export function Layout() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState(false);
  const [tokens, setTokens] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const profile = getUserProfile();
    setTokens(profile.tokens);
    
    // Trigger daily rewards modal on mount if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      const timer = setTimeout(() => setIsRewardsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]); // Re-run when route changes to refresh token count

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        backgroundColor: 'rgba(5, 7, 15, 0.9)', 
        backdropFilter: 'blur(10px)', 
        padding: '0.75rem 0', 
        borderBottom: '1px solid rgba(124, 92, 255, 0.3)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <Link to="/" className="logo-text neon-text" style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-primary)' }}>
            Squard Hub
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Token Counter / Rewards Link */}
            <Link 
              to="/rewards"
              className="gamer-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                textDecoration: 'none',
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }}
            >
              <span style={{ fontSize: '14px' }}>🪙</span>
              <span className="text-ui" style={{ color: '#ffd700', fontWeight: '800', fontSize: '13px' }}>{tokens}</span>
            </Link>

            {/* Profile Button */}
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="gamer-card"
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(124, 92, 255, 0.2)', border: '1px solid var(--accent)',
                color: 'var(--text-primary)', fontSize: '1rem', padding: 0, minHeight: '36px'
              }}
              aria-label="Open Profile"
            >
              👤
            </button>
          </div>
        </div>
      </header>
      
      <LiveActivityFeed />

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: 'rgba(17, 22, 39, 0.9)', backdropFilter: 'blur(10px)', padding: '1.5rem 0', textAlign: 'center', borderTop: '1px solid rgba(124, 92, 255, 0.3)' }}>
        <div className="container">
          <p className="text-caption" style={{ color: 'var(--text-muted)' }}>
            Ads help keep Squard Hub free.
          </p>
        </div>
      </footer>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onProfileUpdate={() => setTokens(getUserProfile().tokens)} 
      />
      
      <DailyRewardsModal 
        isOpen={isRewardsOpen} 
        onClose={() => setIsRewardsOpen(false)} 
        onProfileUpdate={() => setTokens(getUserProfile().tokens)} 
      />
    </div>
  );
}