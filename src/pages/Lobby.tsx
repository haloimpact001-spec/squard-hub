import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useMatches } from '../hooks/useMatches';
import { Swords, Coins, Plus } from 'lucide-react';

export function Lobby() {
  const { data: profile } = useProfile();
  const { matches, isLoading, createMatchMutation, cancelMatchMutation, acceptMatchMutation, settleMatchMutation } = useMatches();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [game, setGame] = useState('Free Fire');
  const [wager, setWager] = useState(10);

  const openMatches = matches?.filter(m => m.status === 'open') || [];
  const activeMatches = matches?.filter(m => m.status === 'active') || [];

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    createMatchMutation.mutate(
      { game, wager },
      {
        onSuccess: () => setIsModalOpen(false),
        onError: (err: any) => alert(err.message),
      }
    );
  };

  const handleCancelMatch = (matchId: string) => {
    if (window.confirm('Cancel this match? Your wager will be refunded.')) {
      cancelMatchMutation.mutate(matchId);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '32px', maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Global Gamer Lobby</h1>
          <p className="text-secondary">Challenge friends and wager your Squard Coins.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> Create Challenge
        </button>
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Active Battles ({activeMatches.length})</h2>
      {activeMatches.length === 0 ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center', marginBottom: '32px' }}>
          <p className="text-secondary">No active battles right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {activeMatches.map(match => {
            const isHost = match.host_id === profile?.id;
            return (
              <div key={match.id} className="card" style={{ borderColor: 'var(--accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase' }}>{match.game}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>IN PROGRESS</span>
                </div>
                <p className="text-secondary" style={{ marginBottom: '8px' }}>{match.host_username} vs {match.challenger_username}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent)', fontWeight: '700' }}>
                  <Coins size={16} /> Pot: {match.wager * 2}
                </div>
                {isHost && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => settleMatchMutation.mutate({ matchId: match.id, winnerIsHost: true })} className="btn btn-primary" style={{ flex: 1, fontSize: '13px' }}>I Won</button>
                    <button onClick={() => settleMatchMutation.mutate({ matchId: match.id, winnerIsHost: false })} className="btn btn-secondary" style={{ flex: 1, fontSize: '13px' }}>They Won</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <h2 style={{ marginBottom: '16px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Open Challenges ({openMatches.length})</h2>
      {isLoading ? (
        <p className="text-secondary">Loading matches...</p>
      ) : openMatches.length === 0 ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <p className="text-secondary">No open challenges. Be the first to post a wager!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {openMatches.map(match => {
            const isHost = match.host_id === profile?.id;
            return (
              <div key={match.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '700', textTransform: 'uppercase' }}>{match.game}</span>
                  <span style={{ fontSize: '12px', color: '#EF4444', fontWeight: '700' }}>LIVE</span>
                </div>
                <p className="text-secondary" style={{ marginBottom: '8px' }}>Host: {match.host_username}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent)', fontWeight: '700' }}>
                  <Coins size={16} /> Wager: {match.wager}
                </div>
                {isHost ? (
                  <button onClick={() => handleCancelMatch(match.id)} className="btn btn-secondary" style={{ width: '100%', fontSize: '13px' }}>Cancel & Refund</button>
                ) : (
                  <button onClick={() => acceptMatchMutation.mutate(match.id)} className="btn btn-primary" style={{ width: '100%', fontSize: '13px' }} disabled={acceptMatchMutation.isPending}>
                    {acceptMatchMutation.isPending ? 'Joining...' : 'Accept Challenge'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 19, 24, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setIsModalOpen(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '24px' }}>Create Challenge</h2>
            <form onSubmit={handleCreateMatch} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Game</label>
                <select value={game} onChange={e => setGame(e.target.value)} className="input">
                  <option>Free Fire</option>
                  <option>Dream League Soccer</option>
                  <option>Lagos Life</option>
                  <option>Call of Duty Mobile</option>
                </select>
              </div>
              <div>
                <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Wager (Coins)</label>
                <input type="number" value={wager} onChange={e => setWager(Math.max(1, parseInt(e.target.value) || 0))} className="input" min="1" required />
                <p className="text-secondary" style={{ fontSize: '12px', marginTop: '8px' }}>Available: {profile?.coins || 0}</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={createMatchMutation.isPending}>
                  {createMatchMutation.isPending ? 'Locking...' : 'Post Challenge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}