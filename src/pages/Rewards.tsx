import { useState, useEffect } from 'react';
import { getUserProfile, spinMysteryBox, UserProfile } from '../lib/localStorage';
import { PaymentModal } from '../components/PaymentModal';

export function Rewards() {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [isSpinning, setIsSpinning] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Refresh profile when page loads or returns to focus
  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleSpin = () => {
    if (profile.tokens < 3 || isSpinning) return;
    setIsSpinning(true);
    setRewardText('');
    
    setTimeout(() => {
      const result = spinMysteryBox();
      const updatedProfile = getUserProfile();
      setProfile(updatedProfile);
      if (result.success && result.reward) {
        setRewardText(result.reward);
      }
      setIsSpinning(false);
    }, 1500);
  };

  const handlePaymentSuccess = () => {
    setProfile(getUserProfile());
    setIsPaymentOpen(false);
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
            {profile.tokens} 🪙
          </div>
        </div>
        <div className="gamer-card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Streak</div>
          <div className="text-header neon-text-secondary" style={{ fontSize: '28px', fontWeight: '900' }}>
            {profile.streak} 🔥
          </div>
        </div>
        <div className="gamer-card" style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Status</div>
          <div className="text-header" style={{ fontSize: '16px', fontWeight: '900', color: profile.isPro ? '#ffd700' : 'var(--text-muted)' }}>
            {profile.isPro ? '★ PRO' : 'FREE'}
          </div>
        </div>
      </div>

      {/* Mystery Box Section */}
      <div className="gamer-card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <h2 className="text-header neon-text-secondary" style={{ fontSize: '18px', marginBottom: '1.5rem' }}>
          Mystery Box
        </h2>
        
        <div style={{ 
          width: '150px', height: '150px', margin: '0 auto 1.5rem auto', 
          background: 'linear-gradient(135deg, #7c5cff, #00e0b8)', 
          borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '4rem', animation: isSpinning ? 'spin 0.5s linear infinite' : 'none',
          boxShadow: '0 0 40px rgba(124, 92, 255, 0.5)',
          border: '2px solid rgba(255,255,255,0.1)'
        }}>
          🎁
        </div>

        {rewardText && (
          <div className="gamer-card" style={{ padding: '1rem', marginBottom: '1rem', borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)', animation: 'fadeIn 0.5s ease-out' }}>
            <p className="text-body" style={{ color: '#ffd700', fontWeight: '700', margin: 0 }}>{rewardText}</p>
          </div>
        )}

        <p className="text-body" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Open the box to win exclusive styles and Pro status!
        </p>

        <button 
          onClick={handleSpin} 
          disabled={profile.tokens < 3 || isSpinning}
          className="gamer-btn" 
          style={{ width: '100%', maxWidth: '300px', opacity: profile.tokens < 3 ? 0.5 : 1, marginBottom: '1rem' }}
        >
          {isSpinning ? 'Opening...' : `Spin Mystery Box (3 🪙)`}
        </button>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          You have {profile.tokens} tokens. Need more?
        </div>
      </div>

      {/* Shop / Top Up Section */}
      <div className="gamer-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h2 className="text-header" style={{ fontSize: '18px', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Token Shop
        </h2>
        <p className="text-body" style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Support the hub and get instant tokens.
        </p>
        <button 
          onClick={() => setIsPaymentOpen(true)}
          className="gamer-btn-secondary"
          style={{ width: '100%', maxWidth: '300px' }}
        >
          Top Up Tokens 💳
        </button>
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={handlePaymentSuccess} 
      />
    </div>
  );
}