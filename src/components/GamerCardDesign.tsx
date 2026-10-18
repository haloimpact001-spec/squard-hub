import { Profile } from '../lib/supabaseClient';

interface GamerCardDesignProps {
  profile: Profile;
  favoriteGame: string;
}

export function GamerCardDesign({ profile, favoriteGame }: GamerCardDesignProps) {
  // CORRECTED: Pointing to your actual live Vercel domain
  const liveUrl = 'https://squardhub-livid.vercel.app/';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(liveUrl)}&color=ffffff&bgcolor=111627`;

  return (
    <div 
      id="squard-gamer-card"
      style={{
        width: '360px',
        height: '540px',
        background: 'linear-gradient(145deg, #0B0D14 0%, #161a28 100%)',
        borderRadius: '24px',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        color: '#F8FAFC'
      }}
    >
      {/* Background Glow Effects */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />

      {/* Header: Brand & Avatar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', letterSpacing: '2px', color: '#94A3B8', fontWeight: '700' }}>OFFICIAL GAMER ID</span>
          <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '1px', marginTop: '4px', fontFamily: 'Orbitron, sans-serif' }}>SQUARD HUB</span>
        </div>
        <div style={{ 
          width: '56px', height: '56px', borderRadius: '16px', 
          background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', fontWeight: '900', color: '#fff',
          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.4)'
        }}>
          {profile.username.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* User Info */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: 0, lineHeight: '1.1' }}>{profile.username}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>
            {profile.is_pro ? '★ PRO PLAYER' : 'FREE TIER'}
          </span>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>Plays {favoriteGame}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', 
        background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)', marginBottom: '2rem',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#F8FAFC' }}>{profile.coins}</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>COINS</div>
        </div>
        <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#F8FAFC' }}>{profile.streak}</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>STREAK</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '800', color: '#10B981' }}>LVL 1</div>
          <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginTop: '4px' }}>RANK</div>
        </div>
      </div>

      {/* Footer: QR Code & Link */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600' }}>JOIN THE SQUAD</span>
          <span style={{ fontSize: '12px', color: '#F8FAFC', fontWeight: '700' }}>squardhub-livid.vercel.app</span>
        </div>
        <img 
          src={qrCodeUrl} 
          alt="QR Code" 
          style={{ width: '64px', height: '64px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.1)' }} 
        />
      </div>
    </div>
  );
}