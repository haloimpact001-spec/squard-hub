import { useState, useRef, useEffect } from 'react';
import { Download, Share2, Trash2, Image as ImageIcon, Type, Smile } from 'lucide-react';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

interface EmojiItem {
  id: string;
  char: string;
  size: number;
  offset: { x: number; y: number };
}

export function StickerMaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [zoom, setZoom] = useState(1);
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  
  const [caption, setCaption] = useState('');
  const [captionColor, setCaptionColor] = useState('#ffffff');
  const [captionSize, setCaptionSize] = useState(48);
  const [captionFont, setCaptionFont] = useState('Impact');
  const [captionOutline, setCaptionOutline] = useState(true);
  const [captionOffset, setCaptionOffset] = useState({ x: 256, y: 450 });
  
  const [emojis, setEmojis] = useState<EmojiItem[]>([]);
  const [activeEmojiId, setActiveEmojiId] = useState<string | null>(null);
  const [shape, setShape] = useState<'square' | 'rounded' | 'circle'>('square');
  const [error, setError] = useState<string | null>(null);
  
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [isDraggingEmoji, setIsDraggingEmoji] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const emojiList = ['😎', '🔥', '💯', '⚡', '👑', '🎮', '⚽', '🇳🇬'];

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  // Render Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 512, 512);
    ctx.save();

    // 1. Apply clipping path
    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(256, 256, 256, 0, Math.PI * 2);
    } else if (shape === 'rounded') {
      const r = 40;
      ctx.moveTo(r, 0); ctx.lineTo(512 - r, 0); ctx.quadraticCurveTo(512, 0, 512, r);
      ctx.lineTo(512, 512 - r); ctx.quadraticCurveTo(512, 512, 512 - r, 512);
      ctx.lineTo(r, 512); ctx.quadraticCurveTo(0, 512, 0, 512 - r);
      ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
    } else {
      ctx.rect(0, 0, 512, 512);
    }
    ctx.closePath();
    ctx.clip();

    // 2. Draw image
    if (image) {
      const imgWidth = image.width * zoom;
      const imgHeight = image.height * zoom;
      const x = (512 - imgWidth) / 2 + imageOffset.x;
      const y = (512 - imgHeight) / 2 + imageOffset.y;
      ctx.drawImage(image, x, y, imgWidth, imgHeight);
    }

    // 3. Draw emojis
    emojis.forEach(emoji => {
      ctx.font = `${emoji.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji.char, emoji.offset.x, emoji.offset.y);
    });

    // 4. Draw caption
    if (caption) {
      ctx.font = `bold ${captionSize}px ${captionFont}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (captionOutline) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(2, captionSize / 10);
        ctx.lineJoin = 'round';
        ctx.strokeText(caption, captionOffset.x, captionOffset.y);
      }
      ctx.fillStyle = captionColor;
      ctx.fillText(caption, captionOffset.x, captionOffset.y);
    }

    ctx.restore();
  }, [image, zoom, imageOffset, caption, captionColor, captionSize, captionFont, captionOutline, captionOffset, emojis, shape]);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setError('Please upload a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB for fast processing.');
      return;
    }
    setError(null);
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage(img);
      setImageUrl(url);
      setImageOffset({ x: 0, y: 0 });
      setZoom(1);
    };
    img.src = url;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 512 / rect.width;
    const scaleY = 512 / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (caption) {
      ctx.font = `bold ${captionSize}px ${captionFont}`;
      const metrics = ctx.measureText(caption);
      if (x >= captionOffset.x - metrics.width/2 && x <= captionOffset.x + metrics.width/2 &&
          y >= captionOffset.y - captionSize/2 && y <= captionOffset.y + captionSize/2) {
        setIsDraggingText(true); setDragStart({ x: e.clientX, y: e.clientY }); return;
      }
    }
    for (let i = emojis.length - 1; i >= 0; i--) {
      const emoji = emojis[i];
      if (x >= emoji.offset.x - emoji.size/2 && x <= emoji.offset.x + emoji.size/2 &&
          y >= emoji.offset.y - emoji.size/2 && y <= emoji.offset.y + emoji.size/2) {
        setActiveEmojiId(emoji.id); setIsDraggingEmoji(true); setDragStart({ x: e.clientX, y: e.clientY }); return;
      }
    }
    setIsDraggingImage(true); setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingImage && !isDraggingText && !isDraggingEmoji) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = 512 / rect.width;
    const scaleY = 512 / rect.height;
    const dx = (e.clientX - dragStart.x) * scaleX;
    const dy = (e.clientY - dragStart.y) * scaleY;

    if (isDraggingImage) setImageOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    else if (isDraggingText) setCaptionOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    else if (isDraggingEmoji && activeEmojiId) {
      setEmojis(prev => prev.map(em => em.id === activeEmojiId ? { ...em, offset: { x: em.offset.x + dx, y: em.offset.y + dy } } : em));
    }
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDraggingImage(false); setIsDraggingText(false); setIsDraggingEmoji(false);
  };

  const handleAddEmoji = (char: string) => {
    const newEmoji: EmojiItem = { id: Date.now().toString(), char, size: 80, offset: { x: 256, y: 256 } };
    setEmojis(prev => [...prev, newEmoji]);
    setActiveEmojiId(newEmoji.id);
    playClick();
  };

  // WhatsApp-Optimized Export
  const exportSticker = async (format: 'webp' | 'png') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    playClick();

    try {
      const blob = await new Promise<Blob | null>(resolve => 
        canvas.toBlob(resolve, `image/${format}`, format === 'webp' ? 0.8 : 1.0)
      );
      
      if (!blob) throw new Error('Export failed');

      if (format === 'webp' && navigator.share) {
        const file = new File([blob], 'squard-sticker.webp', { type: 'image/webp' });
        await navigator.share({
          title: 'My Custom Sticker',
          text: 'Made with Squard Hub!',
          files: [file]
        });
        playSuccess();
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `squard-sticker.${format}`;
        a.click();
        URL.revokeObjectURL(url);
        playSuccess();
      }
    } catch (err) {
      console.error(err);
      playError();
      alert('Failed to export. Please try downloading instead.');
    }
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImage(null); setImageUrl(''); setZoom(1); setImageOffset({ x: 0, y: 0 });
    setCaption(''); setCaptionColor('#ffffff'); setCaptionSize(48); setCaptionFont('Impact');
    setCaptionOutline(true); setCaptionOffset({ x: 256, y: 450 });
    setEmojis([]); setActiveEmojiId(null); setShape('square'); setError(null);
    playClick();
  };

  const activeEmoji = emojis.find(e => e.id === activeEmojiId) || (emojis.length > 0 ? emojis[emojis.length - 1] : null);

  return (
    <div className="container" style={{ paddingTop: '32px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>Sticker Maker</h1>
        <p className="text-secondary">Create 512x512 transparent stickers, perfect for WhatsApp.</p>
      </div>

      <div className="sticker-layout">
        {/* LEFT SIDEBAR: Controls */}
        <aside className="sticker-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={14} /> Upload Image
            </div>
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
            <label htmlFor="file-upload" className="btn btn-primary" style={{ width: '100%', cursor: 'pointer' }}>
              Choose Photo
            </label>
            {error && <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '8px', margin: 0 }}>{error}</p>}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Canvas Settings</div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Zoom</span><span>{Math.round(zoom * 100)}%</span>
              </div>
              <input type="range" min="0.5" max="3" step="0.1" value={zoom} onChange={e => setZoom(parseFloat(e.target.value))} className="sidebar-slider" disabled={!image} />
            </div>
            <select value={shape} onChange={e => setShape(e.target.value as any)} className="input" style={{ minHeight: '40px' }}>
              <option value="square">Square</option>
              <option value="rounded">Rounded Square</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Type size={14} /> Caption
            </div>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Enter text" className="input" style={{ marginBottom: '12px' }} />
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="color" value={captionColor} onChange={e => setCaptionColor(e.target.value)} style={{ width: '40px', height: '40px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'transparent', cursor: 'pointer', padding: '2px' }} />
              <select value={captionFont} onChange={e => setCaptionFont(e.target.value)} className="input" style={{ flex: 1, minHeight: '40px' }}>
                <option value="Impact">Impact</option>
                <option value="Arial Black">Arial Black</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Size</span><span>{captionSize}px</span>
              </div>
              <input type="range" min="20" max="120" value={captionSize} onChange={e => setCaptionSize(parseInt(e.target.value))} className="sidebar-slider" />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={captionOutline} onChange={e => setCaptionOutline(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              Black Outline
            </label>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smile size={14} /> Emojis
            </div>
            <div className="emoji-grid" style={{ marginBottom: '12px' }}>
              {emojiList.map(em => (
                <button key={em} onClick={() => handleAddEmoji(em)} className="emoji-btn">{em}</button>
              ))}
            </div>
            {activeEmoji && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Emoji Size</span><span>{activeEmoji.size}px</span>
                </div>
                <input type="range" min="40" max="200" value={activeEmoji.size} onChange={e => {
                  const size = parseInt(e.target.value);
                  setEmojis(prev => prev.map(em => em.id === activeEmoji.id ? { ...em, size } : em));
                }} className="sidebar-slider" />
              </div>
            )}
          </div>

          <div className="sidebar-section" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => exportSticker('webp')} disabled={!image} className="btn btn-primary" style={{ width: '100%' }}>
              <Share2 size={16} /> Share to WhatsApp
            </button>
            <button onClick={() => exportSticker('png')} disabled={!image} className="btn btn-secondary" style={{ width: '100%' }}>
              <Download size={16} /> Download PNG
            </button>
            <button onClick={handleReset} className="btn btn-secondary" style={{ width: '100%', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              <Trash2 size={16} /> Reset Canvas
            </button>
          </div>
        </aside>

        {/* RIGHT: Canvas Area */}
        <div className="sticker-canvas-area">
          <canvas
            ref={canvasRef}
            width={512}
            height={512}
            style={{
              width: '100%',
              maxWidth: '512px',
              height: 'auto',
              aspectRatio: '1/1',
              touchAction: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23232A33'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23232A33'/%3E%3C/svg%3E")`,
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              cursor: isDraggingImage || isDraggingText || isDraggingEmoji ? 'grabbing' : 'grab'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>
      </div>
    </div>
  );
}