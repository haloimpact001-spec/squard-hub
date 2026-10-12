import { useState, useEffect } from 'react';
import { getUserProfile, handleDailyLogin, spinMysteryBox, UserProfile } from '../lib/localStorage';
import { PaymentModal } from './PaymentModal';

interface DailyRewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: () => void;
}

export function DailyRewardsModal({ isOpen, onClose, onProfileUpdate }: DailyRewardsModalProps) {
  const [profile, setProfile] = useState<UserProfile>(getUserProfile());
  const [showReward, setShowReward] = useState(false);
  const [rewardText, setRewardText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const { isNewDay, profile: updatedProfile } = handleDailyLogin();
      setProfile(updatedProfile);
      if (isNewDay) {
        setTimeout(() => setShowReward(true), 500);
      } else {
        setShowReward(true);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (profile.tokens < 3 || isSpinning) return;
    setIsSpinning(true);
    
    setTimeout(() => {
      const result = spinMysteryBox();
      setProfile(result.profile);
      if (result.success && result.reward) {
        setRewardText(result.reward);
      }
      setIsSpinning(false);
      onProfileUpdate();
    }, 1500);
  };

  const handlePaymentSuccess = () => {
    setProfile(getUserProfile());
    setIsPaymentOpen(false);
    onProfileUpdate();
  };

  return (
    <>
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
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            maxHeight: '90vh', // Prevents cutoff on mobile
            overflowY: 'auto', // Enables scrolling
            padding: '2rem', 
            position: 'relative', 
            textAlign: 'center' 
          }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem', minHeight: 'auto', padding: '0.25rem' }}>✕</button>

          <h2 className="text-title neon-text" style={{ fontSize: '20px', marginBottom: '0.5rem' }}>Daily Rewards</h2>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Streak</div>
              <div className="text-header neon-text-secondary" style={{ fontSize: '24px', fontWeight: '900' }}>{profile.streak} 🔥</div>
            </div>
            <div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Tokens</div>
              <div className="text-header" style={{ fontSize: '24px', fontWeight: '900', color: '#ffd700' }}>{profile.tokens} 🪙</div>
            </div>
          </div>

          {!showReward ? (
            <div className="text-body" style={{ color: 'var(--accent-secondary)' }}>Claiming daily login bonus...</div>
          ) : rewardText ? (
            <div>
              <div className="gamer-card" style={{ padding: '1rem', marginBottom: '1rem', borderColor: '#ffd700', background: 'rgba(255, 215, 0, 0.1)' }}>
                <p className="text-body" style={{ color: '#ffd700', fontWeight: '700', margin: 0 }}>{rewardText}</p>
              </div>
              <button onClick={onClose} className="gamer-btn-secondary" style={{ width: '100%' }}>Awesome!</button>
            </div>
          ) : (
            <div>
              <div style={{ 
                width: '120px', height: '120px', margin: '0 auto 1.5rem auto', 
                background: 'linear-gradient(135deg, #7c5cff, #00e0b8)', 
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', animation: isSpinning ? 'spin 1s linear infinite' : 'none',
                boxShadow: '0 0 30px rgba(124, 92, 255, 0.5)'
              }}>
                🎁
              </div>
              <p className="text-body" style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Spend 3 tokens to open a Mystery Box!
              </p>
              <button 
                onClick={handleSpin} 
                disabled={profile.tokens < 3 || isSpinning}
                className="gamer-btn" 
                style={{ width: '100%', opacity: profile.tokens < 3 ? 0.5 : 1, marginBottom: '0.75rem' }}
              >
                {isSpinning ? 'Spinning...' : `Spin Mystery Box (3 🪙)`}
              </button>
              
              {/* Top Up Button - Now clearly visible and styled */}
              <button 
                onClick={() => setIsPaymentOpen(true)}
                className="gamer-btn-secondary"
                style={{ 
                  width: '100%', 
                  marginBottom: '1rem',
                  background: 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
                  color: '#000',
                  boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
                }}
              >
                Need more tokens? Top Up 🪙
              </button>
            </div>
          )}

          <style>{`
            @keyframes spin { 100% { transform: rotate(360deg); } }
          `}</style>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        onSuccess={handlePaymentSuccess} 
      />
    </>
  );
}