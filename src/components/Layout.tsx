import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, Grid, Swords, Users, IdCard, Coins, LogOut } from 'lucide-react';
import { AuthSplitScreen } from './AuthSplitScreen';
import { ProfileModal } from './ProfileModal';
import { DailyRewardsModal } from './DailyRewardsModal';
import { DirectiveGuide } from './DirectiveGuide';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

export function Layout() {
  const { isProfileOpen, setProfileOpen, isRewardsOpen, setRewardsOpen } = useUIStore();
  const { user, loading, signOut } = useAuth();
  const { data: profile } = useProfile();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    setProfileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

    const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/tools', icon: Grid, label: 'Tools' }, // <-- CHANGED THIS LINE
    { path: '/lobby', icon: Swords, label: 'Lobby' },
    { path: '/squads', icon: Users, label: 'Squads' },
    { path: '/card', icon: IdCard, label: 'Profile' },
  ];
  
  // 1. Show Split-Screen Auth if not logged in
  if (!loading && !user) {
    return <AuthSplitScreen />;
  }

  // 2. Show loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#0F1318', color: '#fff' }}>
        Loading...
      </div>
    );
  }

  // 3. Show Main App Layout
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F1318' }}>
      {/* DESKTOP SIDEBAR */}
      <aside className="desktop-sidebar">
        <div style={{ padding: '8px 16px', marginBottom: '24px' }}>
          <h1 className="logo-text" style={{ fontSize: '20px', margin: 0, color: '#fff' }}>SQUARD HUB</h1>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}>
              <item.icon size={20} strokeWidth={2} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        {profile && (
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginTop: 'auto', backgroundColor: '#171C23', borderColor: '#232A33' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#000', fontSize: '16px' }}>
              {profile.username.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{profile.username}</div>
              <div style={{ fontSize: '12px', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Coins size={12} strokeWidth={2} /> {profile.coins}
              </div>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }} title="Sign Out">
              <LogOut size={18} strokeWidth={2} />
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
            <item.icon size={22} strokeWidth={2} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* MODALS */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setProfileOpen(false)} onLogout={handleLogout} />
      <DailyRewardsModal isOpen={isRewardsOpen} onClose={() => setRewardsOpen(false)} onProfileUpdate={() => {}} />
      <DirectiveGuide />
    </div>
  );
}