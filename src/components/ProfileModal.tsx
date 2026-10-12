import { useState, useEffect } from 'react';
import { 
  getUserProfile, 
  removeSavedName, 
  toggleProStatus,
  UserProfile, 
  SavedName 
} from '../lib/localStorage';
import { CopyButton } from './CopyButton';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: () => void;
}

export function ProfileModal({ isOpen, onClose, onProfileUpdate }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.username);

  useEffect(() => {
    if (isOpen) {
      setProfile(getUserProfile());
      setTempName(getUserProfile().username);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveName = () => {
    const updated = { ...profile, username: tempName || 'Guest_Gamer' };
    setProfile(updated);
    // Note: In a real app, we'd save this to localStorage here.
    // For simplicity, we just update local state. Let's save it:
    const finalProfile = { ...updated };
    localStorage.setItem('squard_hub_user_data', JSON.stringify(finalProfile));
    setEditingName(false);
    onProfileUpdate();
  };

  const handleDeleteName = (id: string) => {
    const updated = removeSavedName(id);
    setProfile(updated);
    onProfileUpdate();
  };

  const handleTogglePro = () => {
    // Simulating Pro upgrade/downgrade
    const updated = toggleProStatus(!profile.isPro);
    setProfile(updated);
    onProfileUpdate();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 15, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="gamer-card"
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: '1.5rem',
            minHeight: 'auto',
            padding: '0.25rem'
          }}
        >
          ✕
        </button>

        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            fontSize: '2rem',
            fontWeight: '900',
            color: '#fff'
          }}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          
          {editingName ? (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
              <input 
                type="text" 
                value={tempName} 
                onChange={e => setTempName(e.target.value)}
                maxLength={15}
                className="gamer-input"
                style={{ maxWidth: '200px', textAlign: 'center', padding: '0.5rem' }}
              />
              <button onClick={handleSaveName} className="gamer-btn-secondary" style={{ minHeight: '36px', padding: '0 1rem' }}>
                Save
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <h2 className="text-title neon-text" style={{ fontSize: '20px', marginBottom: 0 }}>
                {profile.username}
              </h2>
              <button 
                onClick={() => setEditingName(true)}
                style={{ background: 'transparent', color: 'var(--text-muted)', minHeight: 'auto', padding: '0.25rem', fontSize: '12px' }}
              >
                ✎
              </button>
            </div>
          )}

          {/* Pro Badge */}
          <div style={{ marginTop: '0.5rem' }}>
            {profile.isPro ? (
              <span style={{ 
                background: 'linear-gradient(135deg, #ffd700, #ffaa00)', 
                color: '#000', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '20px', 
                fontSize: '11px', 
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                boxShadow: '0 0 15px rgba(255, 215, 0, 0.5)'
              }}>
                ★ Verified Pro
              </span>
            ) : (
              <button 
                onClick={handleTogglePro}
                className="gamer-btn"
                style={{ fontSize: '11px', padding: '0.25rem 0.75rem', minHeight: 'auto', borderRadius: '20px' }}
              >
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>

        {/* Saved Collection */}
        <div>
          <h3 className="text-header neon-text-secondary" style={{ fontSize: '16px', marginBottom: '1rem', borderBottom: '1px solid rgba(124, 92, 255, 0.2)', paddingBottom: '0.5rem' }}>
            My Collection ({profile.savedNames.length})
          </h3>
          
          {profile.savedNames.length === 0 ? (
            <p className="text-body" style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              No saved names yet. Click the heart icon on any name to save it here!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {profile.savedNames.map((item: SavedName) => (
                <div 
                  key={item.id} 
                  className="gamer-card"
                  style={{ 
                    padding: '1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-caption" style={{ color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>
                      {item.styleName}
                    </div>
                    <div className="text-body" style={{ fontWeight: '700', wordBreak: 'break-all' }}>
                      {item.text}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CopyButton text={item.text} />
                    <button 
                      onClick={() => handleDeleteName(item.id)}
                      style={{ 
                        background: 'rgba(255, 77, 77, 0.1)', 
                        color: '#ff4d4d', 
                        border: '1px solid rgba(255, 77, 77, 0.3)',
                        minHeight: '36px',
                        minWidth: '36px',
                        padding: '0',
                        borderRadius: '6px'
                      }}
                      aria-label="Delete name"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}