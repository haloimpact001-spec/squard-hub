import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (game: string, wager: number) => void;
  isSubmitting: boolean;
}

const games = ['Free Fire', 'Dream League Soccer', 'Lagos Life', 'Call of Duty Mobile'];

export function MatchModal({ isOpen, onClose, onSubmit, isSubmitting }: MatchModalProps) {
  const { data: profile } = useProfile();
  const [game, setGame] = useState(games[0]);
  const [wager, setWager] = useState(10);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    if (profile && wager > profile.coins) {
      playError();
      alert(`You only have ${profile.coins} coins. Please lower your wager!`);
      return;
    }
    playSuccess();
    onSubmit(game, wager);
  };

  return (
    <div 
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(5, 7, 15, 0.95)',
        backdropFilter: 'blur(12px)', zIndex: 1002,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="gamer-card"
        style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={() => { playClick(); onClose(); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem', minHeight: 'auto', padding: '0.25rem' }}></button>

        <h2 className="text-title neon-text" style={{ fontSize: '20px', marginBottom: '0.5rem', textAlign: 'center' }}>
          Challenge a Friend
        </h2>
        <p className="text-body" style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '14px' }}>
          Pick a game and set your wager. Your coins are locked until the match ends!
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="text-ui" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>1. Choose Game</label>
            <select value={game} onChange={e => { setGame(e.target.value); playClick(); }} className="sidebar-input">
              {games.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-ui" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>2. Set Wager (Coins)</label>
            <input 
              type="number" 
              value={wager} 
              onChange={e => { setWager(Math.max(1, parseInt(e.target.value) || 0)); playClick(); }}
              className="sidebar-input"
              min="1"
              required
            />
            <p className="text-caption" style={{ marginTop: '0.5rem' }}>
              You have: <span style={{ color: '#ffd700', fontWeight: '700' }}>{profile?.coins ?? 0}</span> coins available.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="gamer-btn-secondary"
            style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1, marginTop: '0.5rem' }}
          >
            {isSubmitting ? 'Locking Coins...' : `🔒 Lock ${wager} Coins & Post`}
          </button>
        </form>
      </div>
    </div>
  );
}