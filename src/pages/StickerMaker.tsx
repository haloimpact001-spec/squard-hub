import { useState, useRef, useEffect } from 'react';
import { AdSlot } from '../components/AdSlot';

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

  const emojiList = ['😎', '🔥', '💯', '⚡', '', '🎮', '⚽', '🇳🇬'];

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 512, 512);
    ctx.save();

    ctx.beginPath();
    if (shape === 'circle') {
      ctx.arc(256, 256, 256, 0, Math.PI * 2);
    } else if (shape === 'rounded') {
      const r = 40;
      ctx.moveTo(r, 0);
      ctx.lineTo(512 - r, 0);
      ctx.quadraticCurveTo(512, 0, 512, r);
      ctx.lineTo(512, 512 - r);
      ctx.quadraticCurveTo(512, 512, 512 - r, 512);
      ctx.lineTo(r, 512);
      ctx.quadraticCurveTo(0, 512, 0, 512 - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
    } else {
      ctx.rect(0, 0, 512, 512);
    }
    ctx.closePath();
    ctx.clip();

    if (image) {
      const imgWidth = image.width * zoom;
      const imgHeight = image.height * zoom;
      const x = (512 - imgWidth) / 2 + imageOffset.x;
      const y = (512 - imgHeight) / 2 + imageOffset.y;
      ctx.drawImage(image, x, y, imgWidth, imgHeight);
    }

    emojis.forEach(emoji => {
      ctx.font = `${emoji.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji.char, emoji.offset.x, emoji.offset.y);
    });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10 MB.');
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
      const textWidth = metrics.width;
      const textHeight = captionSize;
      if (x >= captionOffset.x - textWidth/2 && x <= captionOffset.x + textWidth/2 &&
          y >= captionOffset.y - textHeight/2 && y <= captionOffset.y + textHeight/2) {
        setIsDraggingText(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        return;
      }
    }

    for (let i = emojis.length - 1; i >= 0; i--) {
      const emoji = emojis[i];
      if (x >= emoji.offset.x - emoji.size/2 && x <= emoji.offset.x + emoji.size/2 &&
          y >= emoji.offset.y - emoji.size/2 && y <= emoji.offset.y + emoji.size/2) {
        setActiveEmojiId(emoji.id);
        setIsDraggingEmoji(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        return;
      }
    }

    setIsDraggingImage(true);
    setDragStart({ x: e.clientX, y: e.clientY });
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

    if (isDraggingImage) {
      setImageOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (isDraggingText) {
      setCaptionOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (isDraggingEmoji && activeEmojiId) {
      setEmojis(prev => prev.map(em => em.id === activeEmojiId ? { ...em, offset: { x: em.offset.x + dx, y: em.offset.y + dy } } : em));
    }
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = () => {
    setIsDraggingImage(false);
    setIsDraggingText(false);
    setIsDraggingEmoji(false);
  };

  const handleAddEmoji = (char: string) => {
    const newEmoji: EmojiItem = {
      id: Date.now().toString(),
      char,
      size: 80,
      offset: { x: 256, y: 256 }
    };
    setEmojis(prev => [...prev, newEmoji]);
    setActiveEmojiId(newEmoji.id);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'squard-sticker.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImage(null);
    setImageUrl('');
    setZoom(1);
    setImageOffset({ x: 0, y: 0 });
    setCaption('');
    setCaptionColor('#ffffff');
    setCaptionSize(48);
    setCaptionFont('Impact');
    setCaptionOutline(true);
    setCaptionOffset({ x: 256, y: 450 });
    setEmojis([]);
    setActiveEmojiId(null);
    setShape('square');
    setError(null);
  };

  const activeEmoji = emojis.find(e => e.id === activeEmojiId) || (emojis.length > 0 ? emojis[emojis.length - 1] : null);

  return (
    <div>
      <h1 className="text-title neon-text" style={{ fontSize: '24px', textAlign: 'center', marginBottom: '1rem' }}>
        Custom Sticker Maker
      </h1>

      <div className="sticker-layout">
        {/* Left Sidebar - Controls */}
        <aside className="sticker-sidebar">
          {/* Upload Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Upload Photo</div>
            <input type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
            <label htmlFor="file-upload" className="sidebar-btn gamer-btn" style={{ textAlign: 'center', display: 'block', lineHeight: '36px' }}>
              Choose Photo
            </label>
            {error && <p style={{ color: '#ff4d4d', fontSize: '11px', marginTop: '0.5rem', margin: 0 }}>{error}</p>}
          </div>

          {/* Zoom & Shape Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Canvas Settings</div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <div className="sidebar-label">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="3" 
                step="0.1" 
                value={zoom} 
                onChange={e => setZoom(parseFloat(e.target.value))} 
                className="sidebar-slider"
                disabled={!image} 
              />
            </div>

            <div>
              <div className="sidebar-label">Shape</div>
              <select value={shape} onChange={e => setShape(e.target.value as 'square' | 'rounded' | 'circle')} className="sidebar-select">
                <option value="square">Square</option>
                <option value="rounded">Rounded square</option>
                <option value="circle">Circle</option>
              </select>
            </div>
          </div>

          {/* Caption Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Caption</div>
            
            <input 
              type="text" 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
              placeholder="Enter caption" 
              className="sidebar-input"
              style={{ marginBottom: '0.75rem' }}
            />

            <div className="color-picker-wrapper" style={{ marginBottom: '0.75rem' }}>
              <input 
                type="color" 
                value={captionColor} 
                onChange={e => setCaptionColor(e.target.value)} 
                className="color-picker"
              />
              <select 
                value={captionFont} 
                onChange={e => setCaptionFont(e.target.value)} 
                className="sidebar-select"
              >
                <option value="Impact">Impact</option>
                <option value="Arial Black">Arial Black</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <div className="sidebar-label">
                <span>Size</span>
                <span>{captionSize}px</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="120" 
                value={captionSize} 
                onChange={e => setCaptionSize(parseInt(e.target.value))} 
                className="sidebar-slider"
              />
            </div>

            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={captionOutline} 
                onChange={e => setCaptionOutline(e.target.checked)} 
              />
              <span>Outline</span>
            </label>
          </div>

          {/* Emojis Section */}
          <div className="sidebar-section">
            <div className="sidebar-section-title">Emojis</div>
            
            <div className="emoji-grid" style={{ marginBottom: '0.75rem' }}>
              {emojiList.map(em => (
                <button key={em} onClick={() => handleAddEmoji(em)} className="emoji-btn">
                  {em}
                </button>
              ))}
            </div>

            {activeEmoji && (
              <div>
                <div className="sidebar-label">
                  <span>Emoji Size</span>
                  <span>{activeEmoji.size}px</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="200" 
                  value={activeEmoji.size} 
                  onChange={e => {
                    const size = parseInt(e.target.value);
                    setEmojis(prev => prev.map(em => em.id === activeEmoji.id ? { ...em, size } : em));
                  }} 
                  className="sidebar-slider"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="sidebar-section">
            <button onClick={handleDownload} disabled={!image} className={`sidebar-btn ${image ? 'gamer-btn-secondary' : 'gamer-btn'}`} style={{ opacity: image ? 1 : 0.5, cursor: image ? 'pointer' : 'not-allowed', marginBottom: '0.5rem' }}>
              Download PNG
            </button>
            <button onClick={handleReset} className="sidebar-btn gamer-btn" style={{ background: 'linear-gradient(135deg, #ff4d4d 0%, #cc0000 100%)' }}>
              Reset
            </button>
          </div>
        </aside>

        {/* Right Canvas Area */}
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%23808080'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23808080'/%3E%3C/svg%3E")`,
              borderRadius: '12px',
              border: '2px solid var(--accent)',
              boxShadow: '0 0 30px rgba(124, 92, 255, 0.3)'
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        </div>
      </div>

      <div className="container">
        <AdSlot />
      </div>
    </div>
  );
}