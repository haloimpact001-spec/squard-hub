import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { useProfile } from '../hooks/useProfile';
import { GamerCardDesign } from '../components/GamerCardDesign';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

const games = ['Free Fire', 'Dream League Soccer', 'Lagos Life', 'Call of Duty Mobile', 'PUBG', 'Fortnite'];

export function GamerCard() {
  const { data: profile } = useProfile();
  const [favoriteGame, setFavoriteGame] = useState('Free Fire');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    playClick();
    setIsDownloading(true);

    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        pixelRatio: 2 // High resolution for crisp sharing
      });
      
      const link = document.createElement('a');
      link.download = `${profile?.username || 'squard'}-gamer-card.png`;
      link.href = dataUrl;
      link.click();
      playSuccess();
    } catch (err) {
      console.error('Failed to download card', err);
      playError();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    playClick();

    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      
      // Convert data URL to Blob for sharing
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'squard-gamer-card.png', { type: 'image/png' });

      if (navigator.share) {
        await navigator.share({
          title: 'My Squard Hub Gamer Card',
          text: `Check out my official Gamer ID on Squard Hub!`,
          files: [file]
        });
        playSuccess();
      } else {
        alert('Sharing not supported on this browser. Please download and share manually!');
      }
    } catch (err) {
      console.error('Failed to share', err);
    }
  };

  if (!profile) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 16px', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="text-title neon-text" style={{ fontSize: '24px', marginBottom: '0.5rem' }}>Your Gamer ID</h1>
        <p className="text-body">Customize and share your official Squard Hub card.</p>
      </div>

      {/* Controls */}
      <div className="gamer-card" style={{ padding: '1.5rem', width: '100%', maxWidth: '400px' }}>
        <label className="text-ui" style={{ marginBottom: '0.5rem', display: 'block', color: 'var(--text-muted)' }}>Favorite Game</label>
        <select 
          value={favoriteGame} 
          onChange={(e) => { setFavoriteGame(e.target.value); playClick(); }}
          className="premium-input"
          style={{ marginBottom: '1.5rem' }}
        >
          {games.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="btn-primary" 
            style={{ flex: 1, opacity: isDownloading ? 0.7 : 1 }}
          >
            {isDownloading ? 'Generating...' : 'Download PNG'}
          </button>
          <button 
            onClick={handleShare} 
            className="btn-secondary" 
            style={{ flex: 1 }}
          >
            Share
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div ref={cardRef} style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
        <GamerCardDesign profile={profile} favoriteGame={favoriteGame} />
      </div>
    </div>
  );
}