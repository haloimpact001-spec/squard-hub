import { useProfile } from '../hooks/useProfile';
import { useRewards } from '../hooks/useRewards';
import { useState } from 'react';

export function Rewards() {
  const { data: profile } = useProfile();
  const { claimDailyRewardMutation } = useRewards();
  const [rewardMsg, setRewardMsg] = useState('');

  const handleClaim = () => {
    claimDailyRewardMutation.mutate(undefined, {
      onSuccess: (data) => {
        setRewardMsg(`Claimed ${data.reward} coins! Streak: ${data.streak} 🔥`);
      },
      onError: (err) => {
        setRewardMsg(err.message);
      },
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 16px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="text-title neon-text" style={{ fontSize: '24px', marginBottom: '2rem', textAlign: 'center' }}>
        Rewards Center
      </h1>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <div className="gamer-card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Tokens</div>
          <div className="text-header" style={{ fontSize: '28px', fontWeight: '900', color: '#ffd700' }}>
            {profile?.coins ?? 0} 🪙
          </div>
        </div>
        <div className="gamer-card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Streak</div>
          <div className="text-header neon-text-secondary" style={{ fontSize: '28px', fontWeight: '900' }}>
            {profile?.streak ?? 0} 🔥
          </div>
        </div>
        <div className="gamer-card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</div>
          <div className="text-header" style={{ fontSize: '16px', fontWeight: '900', color: profile?.is_pro ? '#ffd700' : 'var(--text-muted)' }}>
            {profile?.is_pro ? '★ PRO' : 'FREE'}
          </div>
        </div>
      </div>

      {/* Daily Reward Section */}
      <div className="gamer-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="text-header neon-text-secondary" style={{ fontSize: '18px', marginBottom: '1.5rem' }}>
          Daily Login Bonus
        </h2>
        
        <div style={{ 
          width: '120px', height: '120px', margin: '0 auto 1.5rem auto', 
          background: 'linear-gradient(135deg, #7c5cff, #00e0b8)', 
          borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '4rem', boxShadow: '0 0 40px rgba(124, 92, 255, 0.5)'
        }}>
          
        </div>

        {rewardMsg && (
          <div className="gamer-card" style={{ padding: '1rem', marginBottom: '1rem', borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' }}>
            <p className="text-body" style={{ color: '#ffd700', fontWeight: '700', margin: 0 }}>{rewardMsg}</p>
          </div>
        )}

        <button 
          onClick={handleClaim} 
          disabled={claimDailyRewardMutation.isPending}
          className="gamer-btn" 
          style={{ width: '100%', maxWidth: '300px', opacity: claimDailyRewardMutation.isPending ? 0.5 : 1 }}
        >
          {claimDailyRewardMutation.isPending ? 'Claiming...' : 'Claim Daily Reward'}
        </button>
      </div>
    </div>
  );
}