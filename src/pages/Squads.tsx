import { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- ADDED IMPORT
import { Users, Plus, Copy, Trophy, LogOut, Shield, MessageSquare } from 'lucide-react'; // <-- ADDED MessageSquare
import { useMySquad } from '../hooks/useSquads';
import { useProfile } from '../hooks/useProfile';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

export function Squads() {
  const { data: profile } = useProfile();
  const { squad, isLoading, createSquadMutation, joinSquadMutation, leaveSquadMutation } = useMySquad();
  
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [squadName, setSquadName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!squadName.trim()) return;
    playClick();
    createSquadMutation.mutate(squadName, {
      onSuccess: () => { setSquadName(''); setMode(null); playSuccess(); },
      onError: (err: any) => { setError(err.message); playError(); }
    });
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;
    playClick();
    joinSquadMutation.mutate(inviteCode, {
      onSuccess: () => { setInviteCode(''); setMode(null); playSuccess(); },
      onError: (err: any) => { setError(err.message); playError(); }
    });
  };

  const handleCopyInvite = () => {
    if (squad) {
      navigator.clipboard.writeText(squad.invite_code);
      playSuccess();
      alert('Invite code copied!');
    }
  };

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave this squad?')) {
      playClick();
      leaveSquadMutation.mutate();
    }
  };

  if (isLoading) {
    return <div className="container" style={{ paddingTop: '32px', textAlign: 'center' }}><p className="text-secondary">Loading squads...</p></div>;
  }

  // VIEW 1: User is in a squad
  if (squad) {
    // Sort members by coins for leaderboard
    const leaderboard = [...squad.members].sort((a, b) => b.profiles.coins - a.profiles.coins);

    return (
      <div className="container" style={{ paddingTop: '32px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={24} color="var(--accent)" /> {squad.name}
            </h1>
            <p className="text-secondary">{leaderboard.length} members</p>
          </div>
          
          {/* ADDED CHAT BUTTON HERE, GROUPED WITH LEAVE BUTTON */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/chat" className="btn btn-primary">
              <MessageSquare size={16} /> Chat
            </Link>
            <button onClick={handleLeave} className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <LogOut size={16} /> Leave
            </button>
          </div>
        </div>

        {/* Invite Card */}
        <div className="card" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="text-secondary" style={{ fontSize: '12px', marginBottom: '4px' }}>Squad Invite Code</p>
            <p style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '2px', color: 'var(--accent)' }}>{squad.invite_code}</p>
          </div>
          <button onClick={handleCopyInvite} className="btn btn-primary">
            <Copy size={16} /> Copy
          </button>
        </div>

        {/* Leaderboard */}
        <h2 style={{ marginBottom: '16px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Squad Leaderboard</h2>
        <div className="card" style={{ padding: '0' }}>
          {leaderboard.map((member, index) => {
            const isMe = member.user_id === profile?.id;
            return (
              <div key={member.user_id} style={{ 
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', 
                borderBottom: index < leaderboard.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                backgroundColor: isMe ? 'rgba(34, 197, 94, 0.05)' : 'transparent'
              }}>
                <div style={{ width: '24px', textAlign: 'center', fontWeight: '700', color: index === 0 ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {index + 1}
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                  {member.profiles.username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '600', margin: 0 }}>{member.profiles.username} {isMe && <span style={{ fontSize: '12px', color: 'var(--accent)' }}>(You)</span>}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', color: 'var(--accent)' }}>
                  <Trophy size={14} /> {member.profiles.coins}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // VIEW 2: User is NOT in a squad
  return (
    <div className="container" style={{ paddingTop: '32px', maxWidth: '600px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--accent)' }}>
          <Users size={32} />
        </div>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Join a Squad</h1>
        <p className="text-secondary">Team up with friends, compete on the leaderboard, and earn rewards together.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
          <p style={{ color: 'var(--danger)', fontSize: '14px', margin: 0, fontWeight: '500' }}>{error}</p>
        </div>
      )}

      {!mode ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <button onClick={() => { setMode('create'); setError(''); playClick(); }} className="btn btn-primary" style={{ height: '100px', flexDirection: 'column', gap: '8px' }}>
            <Plus size={24} /> Create Squad
          </button>
          <button onClick={() => { setMode('join'); setError(''); playClick(); }} className="btn btn-secondary" style={{ height: '100px', flexDirection: 'column', gap: '8px' }}>
            <Users size={24} /> Join Squad
          </button>
        </div>
      ) : mode === 'create' ? (
        <form onSubmit={handleCreate} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>Create a New Squad</h2>
          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Squad Name</label>
            <input type="text" value={squadName} onChange={e => setSquadName(e.target.value)} className="input" placeholder="e.g. Lagos Legends" maxLength={20} required />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setMode(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={createSquadMutation.isPending}>
              {createSquadMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleJoin} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>Join an Existing Squad</h2>
          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Invite Code</label>
            <input type="text" value={inviteCode} onChange={e => setInviteCode(e.target.value.toUpperCase())} className="input" placeholder="e.g. A1B2C3" maxLength={6} style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', fontSize: '18px', fontWeight: '700' }} required />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setMode(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={joinSquadMutation.isPending}>
              {joinSquadMutation.isPending ? 'Joining...' : 'Join'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}