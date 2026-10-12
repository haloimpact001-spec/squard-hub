import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fontStyles } from '../lib/fontMaps';
import { CopyButton } from '../components/CopyButton';
import { AdSlot } from '../components/AdSlot';
import { Nameplate } from '../features/names/Nameplate';
import { themes, Theme } from '../features/names/themes';
import { addSavedName, getUserProfile } from '../lib/localStorage';

export function NameGenerator() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialName = searchParams.get('q') || '';
  const [input, setInput] = useState(initialName);
  const [selectedName, setSelectedName] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Load saved names to show heart state
  useEffect(() => {
    const profile = getUserProfile();
    const ids = new Set(profile.savedNames.map(n => n.text));
    setSavedIds(ids);
  }, []);

  useEffect(() => {
    if (searchParams.has('q')) {
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setInput(e.target.value);
    }
  };

  const handleNameSelect = (name: string) => {
    setSelectedName(name);
  };

  const handleSaveName = (text: string, styleName: string) => {
    addSavedName(text, styleName);
    setSavedIds(prev => {
      const next = new Set(prev);
      next.add(text);
      return next;
    });
  };

  return (
    <div className="container" style={{ padding: '2rem 16px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="text-title neon-text" style={{ fontSize: '24px', marginBottom: '1.5rem', textAlign: 'center' }}>
        Stylish Name Generator
      </h1>
      
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type your nickname"
          maxLength={20}
          className="gamer-input"
          style={{ maxWidth: '400px', textAlign: 'center', fontSize: '14px' }}
        />
        <p className="text-caption" style={{ marginTop: '0.5rem' }}>
          MAX 20 CHARACTERS
        </p>
      </div>

      {input.trim() === '' ? (
        <div className="gamer-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <p className="text-body" style={{ fontSize: '14px', fontWeight: '600' }}>
            Start typing above to generate your stylish names!
          </p>
        </div>
      ) : (
        <div className="name-grid-container">
          <div className="name-grid">
            {fontStyles.map((style, index) => {
              const convertedName = style.convert(input);
              const isSelected = selectedName === convertedName;
              const isSaved = savedIds.has(convertedName);
              
              return (
                <div 
                  key={index} 
                  className={`name-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleNameSelect(convertedName)}
                >
                  <div className="name-card-style-label">
                    {style.name}
                  </div>
                  <div className="name-card-text">
                    {convertedName}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleSaveName(convertedName, style.name)}
                      style={{
                        background: isSaved ? 'rgba(255, 77, 77, 0.2)' : 'rgba(124, 92, 255, 0.1)',
                        border: `1px solid ${isSaved ? '#ff4d4d' : 'rgba(124, 92, 255, 0.3)'}`,
                        color: isSaved ? '#ff4d4d' : 'var(--text-muted)',
                        borderRadius: '6px',
                        minWidth: '32px',
                        minHeight: '28px',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={isSaved ? 'Saved' : 'Save to collection'}
                    >
                      {isSaved ? '♥' : '♡'}
                    </button>
                    <CopyButton text={convertedName} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedName && (
        <Nameplate 
          name={selectedName} 
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
        />
      )}

      <div className="gamer-card" style={{ marginTop: '2rem', padding: '1rem', borderLeft: '4px solid #ffc800', background: 'rgba(255, 200, 0, 0.05)' }}>
        <p className="text-ui" style={{ color: '#ffd700', margin: 0, fontWeight: '600', fontSize: '13px' }}>
          ⚠️ Some games reject certain symbols. If a name is not accepted, try another style.
        </p>
      </div>

      <AdSlot />
    </div>
  );
}