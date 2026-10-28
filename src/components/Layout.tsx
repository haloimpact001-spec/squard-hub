import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Grid, Swords, Users, User, Coins, LogOut, WifiOff, Bell, Settings } from 'lucide-react';
import { AuthSplitScreen } from './AuthSplitScreen';
import { ProfileModal } from './ProfileModal';
import { DailyRewardsModal } from './DailyRewardsModal';
import { DirectiveGuide } from './DirectiveGuide';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';
import { trackPageView } from '../lib/analytics';

export function Layout() {
  const { isProfileOpen, setProfileOpen, isRewardsOpen, setRewardsOpen } = useUIStore();
  const { user, loading, signOut } = useAuth();
  const { data: profile } = useProfile();
  const location = useLocation();

  useEffect(() => { trackPageView(location.pathname); }, [location.pathname]);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); };
  }, []);
  
  const handleLogout = async () => { await signOut(); setProfileOpen(false); };
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home', tooltip: 'Home' },
    { path: '/tools', icon: Grid, label: 'Tools', tooltip: 'Tools Hub' },
    { path: '/lobby', icon: Swords, label: 'Lobby', tooltip: 'Gamer Lobby' },
    { path: '/squads', icon: Users, label: 'Squads', tooltip: 'Your Squads' },
  ];

  if (!loading && !user) return <AuthSplitScreen />;
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-normal)' }}>Loading Squard Hub...</div>;

  return (
    <div className="app-layout">
      {isOffline && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'var(--danger)', color: '#fff', textAlign: 'center', padding: '8px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <WifiOff size={16} /> You are offline
        </div>
      )}

      {/* 1. LEFT ICON BAR */}
      <nav className="icon-bar" style={{ marginTop: isOffline ? '33px' : '0' }}>
        <div className="icon-btn active" title="Squard Hub" style={{ borderRadius: '16px', background: 'var(--accent)', color: '#000', fontWeight: '900', fontSize: '20px' }}>S</div>
        <div style={{ width: '32px', height: '2px', background: '#35363C', borderRadius: '1px', margin: '4px 0' }} />
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`icon-btn ${isActive(item.path) ? 'active' : ''}`} title={item.tooltip}>
            <item.icon size={24} strokeWidth={2} />
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <Link to="/profile" className={`icon-btn ${isActive('/profile') ? 'active' : ''}`} title="Profile" style={{ background: 'var(--accent)', color: '#000', fontWeight: '700' }}>
          {profile?.username?.charAt(0).toUpperCase() || 'U'}
        </Link>
      </nav>

      {/* 2. SIDEBAR */}
      <aside className="sidebar" style={{ marginTop: isOffline ? '33px' : '0' }}>
        <div className="sidebar-header">
          <h1 className="logo-text" style={{ fontSize: '16px' }}>SQUARD HUB</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="user-panel-btn"><Bell size={18} /></button>
            <button className="user-panel-btn"><Settings size={18} /></button>
          </div>
        </div>
        
        <div className="sidebar-content">
          <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px', paddingLeft: '8px' }}>Quick Actions</div>
          <Link to="/lobby" className="sidebar-item"><Swords size={18} /> Create Match</Link>
          <Link to="/squads" className="sidebar-item"><Users size={18} /> Find Squad</Link>
          <Link to="/tools" className="sidebar-item"><Grid size={18} /> App Tools</Link>
          
          <div style={{ marginTop: '24px' }}>
            <div className="text-xs" style={{ textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px', paddingLeft: '8px' }}>Your Stats</div>
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
              <Coins size={20} color="var(--accent)" />
              <div>
                <div className="text-xs">Squard Coins</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--header-primary)' }}>{profile?.coins || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Panel */}
        <div className="user-panel">
          <div className="user-panel-avatar">{profile?.username?.charAt(0).toUpperCase() || 'U'}</div>
          <div className="user-panel-info">
            <div className="user-panel-name">{profile?.username || 'User'}</div>
            <div className="user-panel-discriminator">Online</div>
          </div>
          <button className="user-panel-btn" onClick={handleLogout} title="Sign Out"><LogOut size={18} /></button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT */}
      <main className="main-content" style={{ marginTop: isOffline ? '33px' : '0' }}>
        <Outlet />
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        {[...navItems, { path: '/profile', icon: User, label: 'Profile' }].map((item) => (
          <Link key={item.path} to={item.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: isActive(item.path) ? 'var(--accent)' : 'var(--text-muted)', textDecoration: 'none', fontSize: '11px', fontWeight: '500' }}>
            <item.icon size={22} strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} onLogout={handleLogout} />
      <DailyRewardsModal isOpen={isRewardsOpen} onClose={() => setRewardsOpen(false)} onProfileUpdate={() => {}} />
      <DirectiveGuide />
    </div>
  );
}