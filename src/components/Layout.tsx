import { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProfileModal } from './ProfileModal';
import { DailyRewardsModal } from './DailyRewardsModal';
import { LiveActivityFeed } from './LiveActivityFeed';
import { DirectiveGuide } from './DirectiveGuide';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { playClick } from '../lib/soundEngine';

// Tool definitions for the dropdown menu
const TOOLS = [
  { id: 'names', name: 'Name Generator', path: '/names', icon: 'T', available: true },
  { id: 'stickers', name: 'Sticker Maker', path: '/stickers', icon: '', available: true },
  { id: 'card', name: 'Gamer ID Card', path: '/card', icon: '🪪', available: true }, // <-- ADD THIS LINE
  { id: 'chat', name: 'Squad Chat', path: '#', icon: '💬', available: false },
  { id: 'teams', name: 'Teams & Clans', path: '#', icon: '🛡️', available: false },
  { id: 'tournaments', name: 'Tournaments', path: '#', icon: '🏆', available: false },
];

export function Layout() {
  const { isProfileOpen, setProfileOpen, isRewardsOpen, setRewardsOpen, setAuthOpen } = useUIStore();
  const { user, loading, signOut } = useAuth();
  const { data: profile } = useProfile();
  const location = useLocation();

  // New state for the Tools dropdown menu
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Show Auth modal if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      setAuthOpen(true);
    }
  }, [loading, user, setAuthOpen]);

  // Close tools menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menu when navigating
  useEffect(() => {
    setIsToolsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
    setAuthOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* --- PREMIUM HEADER --- */}
      <header style={{ 
        backgroundColor: 'rgba(11, 13, 20, 0.85)', 
        backdropFilter: 'blur(12px)', 
        padding: '0.75rem 0', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100 
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          
          {/* LEFT: Navigation Icons */}
          <div style={{ display: 'flex', gap: '0.5rem', minWidth: '100px' }}>
            <Link to="/" onClick={() => playClick()} className="nav-icon-btn" aria-label="Home" title="Home">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </Link>
            
            {/* TOOLS LAUNCHPAD BUTTON */}
            <div ref={toolsMenuRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => { playClick(); setIsToolsOpen(!isToolsOpen); }} 
                className="nav-icon-btn" 
                aria-label="Tools Menu" 
                title="All Tools"
                style={{ background: isToolsOpen ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>

              {/* TOOLS DROPDOWN MENU */}
              {isToolsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '52px',
                  left: '0',
                  width: '220px',
                  background: 'rgba(11, 13, 20, 0.95)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  zIndex: 200,
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ padding: '0.5rem 0.75rem', fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                    App Tools
                  </div>
                  {TOOLS.map((tool) => (
                    tool.available ? (
                      <Link 
                        key={tool.id} 
                        to={tool.path} 
                        onClick={() => playClick()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.75rem', borderRadius: '8px',
                          color: 'var(--text-primary)', textDecoration: 'none',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{tool.icon}</span>
                        <span className="text-ui">{tool.name}</span>
                      </Link>
                    ) : (
                      <div 
                        key={tool.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.75rem', borderRadius: '8px',
                          color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.6
                        }}
                      >
                        <span style={{ fontSize: '16px', width: '24px', textAlign: 'center' }}>{tool.icon}</span>
                        <span className="text-ui" style={{ flex: 1 }}>{tool.name}</span>
                        <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>SOON</span>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Brand Logo */}
          <Link to="/" onClick={() => playClick()} className="logo-text" style={{ 
            fontSize: '1.1rem', 
            fontWeight: '900', 
            color: 'var(--text-primary)',
            letterSpacing: '2px',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            SQUARD HUB
          </Link>
          
          {/* RIGHT: User Actions */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '100px', justifyContent: 'flex-end' }}>
            {user && profile && (
              <>
                {/* LOBBY BUTTON */}
                <Link 
                  to="/lobby"
                  onClick={() => playClick()}
                  className="nav-icon-btn"
                  aria-label="Gamer Lobby"
                  title="Gamer Lobby"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
                    <path d="M13 19l6-6"/>
                    <path d="M16 16l4 4"/>
                    <path d="M19 21l2-2"/>
                  </svg>
                </Link>

                {/* COINS / REWARDS */}
                <Link 
                  to="/rewards"
                  onClick={() => playClick()}
                  className="nav-icon-btn"
                  style={{ width: 'auto', padding: '0 0.75rem', gap: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                >
                  <span style={{ fontSize: '14px' }}>🪙</span>
                  <span className="text-ui" style={{ color: 'var(--accent-secondary)', fontSize: '13px', fontWeight: '700' }}>{profile.coins}</span>
                </Link>

                {/* PROFILE */}
                <button 
                  onClick={() => { playClick(); setProfileOpen(true); }}
                  className="nav-icon-btn"
                  aria-label="Open Profile"
                  title="Profile"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
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

      <footer style={{ backgroundColor: 'rgba(11, 13, 20, 0.85)', backdropFilter: 'blur(12px)', padding: '1.5rem 0', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <p className="text-caption">Built for the global gaming community.</p>
        </div>
      </footer>

      {/* Modals */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} onLogout={handleLogout} />
      <DailyRewardsModal isOpen={isRewardsOpen} onClose={() => setRewardsOpen(false)} onProfileUpdate={() => {}} />
      <DirectiveGuide />
    </div>
  );
}