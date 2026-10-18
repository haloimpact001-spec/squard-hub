import { useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProfileModal } from './ProfileModal';
import { DailyRewardsModal } from './DailyRewardsModal';
import { LiveActivityFeed } from './LiveActivityFeed';
import { AuthModal } from './AuthModal';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export function Layout() {
  const { isProfileOpen, setProfileOpen, isRewardsOpen, setRewardsOpen, setAuthOpen } = useUIStore();
  const { user, loading, signOut } = useAuth();
  const { data: profile } = useProfile();
  const location = useLocation();

  // Show Auth modal if user is not logged in and not loading
  useEffect(() => {
    if (!loading && !user) {
      setAuthOpen(true);
    }
  }, [loading, user, setAuthOpen]);

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    setAuthOpen(true);
  };

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
          
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user && profile && (
              <>
                <Link 
                  to="/lobby"
                  className="gamer-card"
                  style={{
                    padding: '0.4rem 0.8rem',
                    textDecoration: 'none',
                    background: 'rgba(255, 77, 77, 0.1)',
                    border: '1px solid rgba(255, 77, 77, 0.3)',
                    color: '#ff4d4d',
                    fontWeight: '800',
                    fontSize: '12px',
                    textTransform: 'uppercase'
                  }}
                >
                  ⚔️ Lobby
                </Link>

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
                  <span className="text-ui" style={{ color: '#ffd700', fontWeight: '800', fontSize: '13px' }}>{profile.coins}</span>
                </Link>

                <button 
                  onClick={() => setProfileOpen(true)}
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
              </>
            )}
          </nav>
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

      {/* Modals */}
      <AuthModal />
      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setProfileOpen(false)} 
        onLogout={handleLogout}
      />
      <DailyRewardsModal 
        isOpen={isRewardsOpen} 
        onClose={() => setRewardsOpen(false)} 
        onProfileUpdate={() => {}} 
      />
    </div>
  );
}