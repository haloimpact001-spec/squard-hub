import { useState } from 'react';
import { X, Send, Gamepad2, Hash, User } from 'lucide-react';
import { playClick, playSuccess } from '../lib/soundEngine';

// ️ REPLACE THIS WITH YOUR ACTUAL WHATSAPP NUMBER (Include country code, no + sign)
const MY_WHATSAPP_NUMBER = "2348012345678"; 

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'diamonds' | 'accounts';
}

export function WhatsAppCheckout({ isOpen, onClose, type }: CheckoutProps) {
  const [game, setGame] = useState('Free Fire');
  const [amount, setAmount] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  const handleOrder = () => {
    playClick();
    
    let message = "";
    if (type === 'diamonds') {
      message = `Hello Squard Hub! 👋\n\nI want to buy *${amount} Diamonds* for *${game}*.\n\n🎮 Player ID: ${playerId}\n\nHow can I pay with Opay/Bank Transfer?`;
    } else {
      message = `Hello Squard Hub! 👋\n\nI am interested in *${game === 'Buying' ? 'Buying' : 'Selling'} a Game Account*.\n\n Details: ${details}\n\nLet's discuss the price and safety.`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    playSuccess();
    onClose();
  };

  return (
    <div 
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 19, 24, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} 
      onClick={onClose}
    >
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '24px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>
            {type === 'diamonds' ? '💎 Buy Diamonds/UC' : '🛒 Account Trader'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Gamepad2 size={14} /> Select Game
            </label>
            <select value={game} onChange={e => setGame(e.target.value)} className="input">
              {type === 'diamonds' ? (
                <>
                  <option>Free Fire (Diamonds)</option>
                  <option>COD Mobile (CP)</option>
                  <option>PUBG Mobile (UC)</option>
                  <option>Mobile Legends</option>
                </>
              ) : (
                <>
                  <option>Buying an Account</option>
                  <option>Selling my Account</option>
                </>
              )}
            </select>
          </div>

          {type === 'diamonds' ? (
            <>
              <div>
                <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Hash size={14} /> Amount (e.g., 100 Diamonds)
                </label>
                <input type="text" value={amount} onChange={e => setAmount(e.target.value)} className="input" placeholder="100 Diamonds" />
              </div>
              <div>
                <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> Player ID
                </label>
                <input type="text" value={playerId} onChange={e => setPlayerId(e.target.value)} className="input" placeholder="Enter your Player ID" />
              </div>
            </>
          ) : (
            <div>
              <label className="text-secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Account Details (Level, Skins, Price)
              </label>
              <textarea value={details} onChange={e => setDetails(e.target.value)} className="input" style={{ minHeight: '80px', resize: 'none' }} placeholder="e.g., Level 50, 5 Legendary skins, asking for ₦15,000" />
            </div>
          )}

          <button onClick={handleOrder} className="btn btn-primary" style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Send size={18} /> Order via WhatsApp
          </button>
          <p className="text-secondary" style={{ fontSize: '12px', textAlign: 'center', margin: 0 }}>
            Secure & Verified. Pay via Opay/Bank Transfer.
          </p>
        </div>
      </div>
    </div>
  );
}