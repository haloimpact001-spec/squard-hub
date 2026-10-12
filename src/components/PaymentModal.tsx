import { useState } from 'react';
import { simulatePayment, getUserProfile } from '../lib/localStorage';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const packages = [
  { id: 1, amount: 200, tokens: 20, label: 'Starter Pack', popular: false },
  { id: 2, amount: 500, tokens: 50, label: 'Pro Upgrade + Bonus', popular: true },
  { id: 3, amount: 1000, tokens: 100, label: 'Whale Pack', popular: false },
];

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');

  if (!isOpen) return null;

  const handlePay = () => {
    if (!selectedPackage) return;
    setIsProcessing(true);
    
    // Simulate network request to Paystack/Flutterwave
    setTimeout(() => {
      const pkg = packages.find(p => p.id === selectedPackage);
      if (pkg) {
        simulatePayment(pkg.amount);
        setIsProcessing(false);
        onSuccess();
      }
    }, 2000);
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
        style={{ width: '100%', maxWidth: '420px', padding: '1.5rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', color: 'var(--text-muted)', fontSize: '1.5rem', minHeight: 'auto', padding: '0.25rem' }}>✕</button>

        {/* Paystack-style Header */}
        <div style={{ borderBottom: '1px solid rgba(124, 92, 255, 0.2)', paddingBottom: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '24px', height: '24px', background: '#00e0b8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#000', fontSize: '14px' }}>P</div>
          <span className="text-body" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Paystack</span>
          <span className="text-caption" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>Secure Checkout</span>
        </div>

        <h3 className="text-header neon-text-secondary" style={{ fontSize: '16px', marginBottom: '1rem' }}>Select a Package</h3>

        {/* Packages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {packages.map(pkg => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              style={{
                background: selectedPackage === pkg.id ? 'rgba(0, 224, 184, 0.1)' : 'rgba(21, 27, 46, 0.6)',
                border: `1px solid ${selectedPackage === pkg.id ? 'var(--accent-secondary)' : 'rgba(124, 92, 255, 0.2)'}`,
                borderRadius: '8px',
                padding: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                position: 'relative',
                color: 'var(--text-primary)'
              }}
            >
              {pkg.popular && (
                <span style={{ position: 'absolute', top: '-8px', right: '10px', background: '#ffd700', color: '#000', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>POPULAR</span>
              )}
              <div style={{ textAlign: 'left' }}>
                <div className="text-ui" style={{ fontWeight: '700' }}>{pkg.label}</div>
                <div className="text-caption" style={{ color: '#ffd700' }}>+{pkg.tokens} 🪙 Tokens</div>
              </div>
              <div className="text-header" style={{ fontWeight: '900', color: 'var(--accent-secondary)' }}>₦{pkg.amount}</div>
            </button>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Payment Method</div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['card', 'bank', 'ussd'] as const).map(method => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: paymentMethod === method ? 'rgba(124, 92, 255, 0.2)' : 'rgba(21, 27, 46, 0.6)',
                border: `1px solid ${paymentMethod === method ? 'var(--accent)' : 'rgba(124, 92, 255, 0.2)'}`,
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                minHeight: '36px'
              }}
            >
              {method === 'card' ? ' Card' : method === 'bank' ? '🏦 Transfer' : '📱 USSD'}
            </button>
          ))}
        </div>

        {/* Pay Button */}
        <button 
          onClick={handlePay} 
          disabled={!selectedPackage || isProcessing}
          className="gamer-btn-secondary"
          style={{ width: '100%', opacity: !selectedPackage || isProcessing ? 0.5 : 1 }}
        >
          {isProcessing ? 'Processing...' : `Pay ₦${selectedPackage ? packages.find(p => p.id === selectedPackage)?.amount : 0}`}
        </button>
        
        <p className="text-caption" style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)' }}>
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}