import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useAuth } from '../hooks/useAuth';
import { Coins, Shield, Calendar, Edit3, Check, LogOut, Hash } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

export function Profile() {
  const { data: profile, refetch } = useProfile();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !profile) return;
    setIsSaving(true);
    playClick();
    const { error } = await supabase.from('profiles').update({ username: newUsername.trim() }).eq('id', profile.id);
    if (error) { playError(); alert('Username taken or error occurred.'); } 
    else { playSuccess(); setIsEditing(false); refetch(); }
    setIsSaving(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  if (!profile) return <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <>
      <div className="content-header">
        <Hash size={24} color="var(--text-muted)" />
        <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--header-primary)' }}>profile</h1>
      </div>

      <div className="content-body" style={{ display: 'flex', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>
          
          {/* Discord Profile Card */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'var(--bg-secondary)' }}>
            {/* Banner */}
            <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--accent) 0%, #16A34A 100%)' }} />
            
            <div style={{ padding: '0 24px 24px 24px', position: 'relative' }}>
              {/* Avatar */}
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent)', color: '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800',
                border: '6px solid var(--bg-secondary)', marginTop: '-40px', marginBottom: '16px'
              }}>
                {profile.username.charAt(0).toUpperCase()}
              </div>

              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  {isEditing ? (
                    <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="input" style={{ width: '180px', minHeight: '32px' }} autoFocus />
                      <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ minHeight: '32px', padding: '0 12px' }}><Check size={16} /></button>
                    </form>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '24px', margin: 0, color: 'var(--header-primary)' }}>{profile.username}</h2>
                      <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit3 size={16} /></button>
                    </div>
                  )}
                  <div className="text-muted" style={{ fontSize: '14px', marginTop: '4px' }}>
                    <Calendar size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0 -24px 24px -24px' }} />

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--header-primary)', marginBottom: '8px' }}>Squard Coins</h3>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                    <Coins size={24} color="var(--accent)" />
                    <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--header-primary)' }}>{profile.coins}</span>
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--header-primary)', marginBottom: '8px' }}>Reputation</h3>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                    <Shield size={24} color="#5865F2" />
                    <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--header-primary)' }}>{profile.reputation || 100}</span>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: '700', color: 'var(--header-primary)', marginBottom: '8px' }}>Account Settings</h3>
                <div className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--header-primary)' }}>Email Address</div>
                    <div className="text-muted" style={{ fontSize: '13px' }}>{profile.email || 'Not linked'}</div>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <button onClick={handleLogout} className="btn btn-danger" style={{ width: '100%', marginTop: '24px', gap: '8px' }}>
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}