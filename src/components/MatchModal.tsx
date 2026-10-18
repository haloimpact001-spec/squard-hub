import { useState } from 'react';
import { useProfile } from '../hooks/useProfile';

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
    if (profile && wager > profile.coins) {
      alert('Insufficient coins!');
      return;
    }
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
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem', minHeight: 'auto', padding: '0.25rem' }}>✕</button>

        <h2 className="text-title neon-text" style={{ fontSize: '20px', marginBottom: '1.5rem', textAlign: 'center' }}>
          Create Challenge
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="sidebar-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Game</label>
            <select value={game} onChange={e => setGame(e.target.value)} className="sidebar-select">
              {games.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="sidebar-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Wager Amount (Coins)</label>
            <input 
              type="number" 
              value={wager} 
              onChange={e => setWager(Math.max(1, parseInt(e.target.value) || 0))}
              className="sidebar-input"
              min="1"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="gamer-btn-secondary"
            style={{ width: '100%', opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? 'Locking Wager...' : `Lock Wager (${wager} 🪙)`}
          </button>
        </form>
      </div>
    </div>
  );
}