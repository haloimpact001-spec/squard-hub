import { useProfile } from '../hooks/useProfile';
import { Profile } from '../lib/supabaseClient';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function ProfileModal({ isOpen, onClose, onLogout }: ProfileModalProps) {
  const { data: profile, isLoading } = useProfile();

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(5, 7, 15, 0.95)',
        backdropFilter: 'blur(12px)', zIndex: 1001,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="gamer-card"
        style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem', minHeight: 'auto', padding: '0.25rem' }}>✕</button>

        {isLoading ? (
          <p className="text-body" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading profile...</p>
        ) : profile ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem auto', fontSize: '2rem', fontWeight: '900', color: '#fff'
            }}>
              {profile.username.charAt(0).toUpperCase()}
            </div>
            
            <h2 className="text-title neon-text" style={{ fontSize: '20px', marginBottom: '0.5rem' }}>
              {profile.username}
            </h2>

            <div style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
              {profile.is_pro ? (
                <span style={{ 
                  background: 'linear-gradient(135deg, #ffd700, #ffaa00)', color: '#000', 
                  padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '11px', fontWeight: '800'
                }}>
                  ★ Verified Pro
                </span>
              ) : (
                <span className="text-caption" style={{ color: 'var(--text-muted)' }}>Free Tier</span>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem' }}>
              <div>
                <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Coins</div>
                <div className="text-header" style={{ color: '#ffd700', fontSize: '20px' }}>{profile.coins} 🪙</div>
              </div>
              <div>
                <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Streak</div>
                <div className="text-header neon-text-secondary" style={{ fontSize: '20px' }}>{profile.streak} 🔥</div>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="gamer-btn"
              style={{ width: '100%', background: 'linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%)' }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p className="text-body" style={{ textAlign: 'center', color: '#ff4d4d' }}>Profile not found.</p>
        )}
      </div>
    </div>
  );
}