import { Link } from 'react-router-dom';
import { Swords, Type, Image, IdCard, ArrowRight } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export function Home() {
  const { data: profile } = useProfile();

  return (
    <div className="container" style={{ paddingTop: '32px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Welcome back, {profile?.username || 'Gamer'}</h1>
        <p className="text-secondary">Ready to customize your profile or challenge a friend?</p>
      </div>

      <Link to="/lobby" className="btn btn-primary" style={{ width: '100%', marginBottom: '32px', height: '56px', fontSize: '16px', justifyContent: 'space-between', padding: '0 24px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Swords size={20} /> Challenge a Friend in the Lobby</span>
        <ArrowRight size={20} />
      </Link>

      <h2 style={{ marginBottom: '16px', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Quick Tools</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        <Link to="/names" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><Type size={24} /></div>
          <div><h3 style={{ marginBottom: '4px' }}>Name Generator</h3><p className="text-secondary" style={{ fontSize: '14px' }}>Create stylish nicknames for any game.</p></div>
        </Link>
        <Link to="/stickers" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><Image size={24} /></div>
          <div><h3 style={{ marginBottom: '4px' }}>Sticker Maker</h3><p className="text-secondary" style={{ fontSize: '14px' }}>Design custom transparent stickers.</p></div>
        </Link>
        <Link to="/card" className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}><IdCard size={24} /></div>
          <div><h3 style={{ marginBottom: '4px' }}>Gamer ID Card</h3><p className="text-secondary" style={{ fontSize: '14px' }}>Generate and share your official profile.</p></div>
        </Link>
      </div>
    </div>
  );
}