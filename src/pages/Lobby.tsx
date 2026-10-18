import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useMatches } from '../hooks/useMatches';
import { MatchModal } from '../components/MatchModal';

export function Lobby() {
  const { data: profile } = useProfile();
  const { 
    matches, isLoading, createMatchMutation, cancelMatchMutation, 
    acceptMatchMutation, settleMatchMutation 
  } = useMatches();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openMatches = matches?.filter(m => m.status === 'open') || [];
  const activeMatches = matches?.filter(m => m.status === 'active') || [];

  const handleCreateMatch = (game: string, wager: number) => {
    createMatchMutation.mutate(
      { game, wager },
      {
        onSuccess: () => setIsModalOpen(false),
        onError: (err) => alert(err.message),
      }
    );
  };

  return (
    <div className="container" style={{ padding: '2rem 16px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 className="text-title neon-text" style={{ fontSize: '24px', marginBottom: '2rem', textAlign: 'center' }}>
        Global Gamer Lobby
      </h1>

      {/* Wallet Header */}
      <div className="gamer-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Your Wallet</div>
          <div className="text-header" style={{ fontSize: '28px', fontWeight: '900', color: '#ffd700' }}>
            {profile?.coins ?? 0} 🪙 Squard Coins
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="gamer-btn-secondary"
          style={{ minWidth: '200px' }}
        >
          ⚔️ Create New Challenge
        </button>
      </div>

      {/* ACTIVE MATCHES (In Progress) */}
      <h2 className="text-header" style={{ fontSize: '18px', marginBottom: '1rem', color: '#00e0b8' }}>
        ⚡ Active Battles ({activeMatches.length})
      </h2>
      
      {activeMatches.length === 0 ? (
        <p className="text-body" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>No active battles right now.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {activeMatches.map(match => {
            const isHost = match.host_id === profile?.id;
            return (
              <div key={match.id} className="gamer-card" style={{ padding: '1.5rem', borderColor: '#00e0b8' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0, 224, 184, 0.2)', color: '#00e0b8', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                  IN PROGRESS
                </div>
                <div className="text-caption" style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>{match.game}</div>
                <div className="text-body" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                  {match.host_username} vs {match.challenger_username}
                </div>
                <div className="text-header" style={{ color: '#ffd700', fontSize: '20px', fontWeight: '900', marginBottom: '1rem' }}>
                  Pot: {match.wager * 2} 🪙
                </div>
                
                {isHost && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => {
                        if(window.confirm('Declare YOURSELF as the winner?')) {
                          settleMatchMutation.mutate({ matchId: match.id, winnerIsHost: true });
                        }
                      }}
                      className="gamer-btn-secondary"
                      style={{ flex: 1, fontSize: '11px' }}
                    >
                      I Won
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Declare CHALLENGER as the winner?')) {
                          settleMatchMutation.mutate({ matchId: match.id, winnerIsHost: false });
                        }
                      }}
                      className="gamer-btn"
                      style={{ flex: 1, fontSize: '11px', background: '#555' }}
                    >
                      They Won
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* OPEN MATCHES (Waiting for Challenger) */}
      <h2 className="text-header neon-text-secondary" style={{ fontSize: '18px', marginBottom: '1rem' }}>
        Open Challenges ({openMatches.length})
      </h2>
      
      {isLoading ? (
        <p className="text-body" style={{ color: 'var(--text-muted)' }}>Loading matches...</p>
      ) : openMatches.length === 0 ? (
        <div className="gamer-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          No active challenges. Be the first to post a wager!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {openMatches.map(match => {
            const isHost = match.host_id === profile?.id;
            return (
              <div key={match.id} className="gamer-card" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 77, 77, 0.2)', color: '#ff4d4d', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700' }}>
                  LIVE
                </div>
                <div className="text-caption" style={{ color: 'var(--accent-secondary)', marginBottom: '0.5rem' }}>{match.game}</div>
                <div className="text-body" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>Host: {match.host_username}</div>
                <div className="text-header" style={{ color: '#ffd700', fontSize: '20px', fontWeight: '900', marginBottom: '1rem' }}>
                  Wager: {match.wager} 🪙
                </div>
                
                {isHost ? (
                  <button 
                    onClick={() => {
                      if(window.confirm('Cancel this match? Your wager will be refunded.')) {
                        cancelMatchMutation.mutate(match.id);
                      }
                    }}
                    className="gamer-btn"
                    style={{ width: '100%', fontSize: '12px', background: '#555' }}
                  >
                    Cancel & Refund
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if(window.confirm(`Accept this ${match.wager} coin challenge?`)) {
                        acceptMatchMutation.mutate(match.id);
                      }
                    }}
                    className="gamer-btn"
                    style={{ width: '100%', fontSize: '12px' }}
                    disabled={acceptMatchMutation.isPending}
                  >
                    {acceptMatchMutation.isPending ? 'Joining...' : 'Accept Challenge'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <MatchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateMatch}
        isSubmitting={createMatchMutation.isPending}
      />
    </div>
  );
}