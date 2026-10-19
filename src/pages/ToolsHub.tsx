import { Link } from 'react-router-dom';
import { Type, Image, IdCard, ArrowRight } from 'lucide-react';

export function ToolsHub() {
  const tools = [
    {
      path: '/names',
      icon: Type,
      title: 'Name Generator',
      description: 'Create stylish nicknames for Free Fire, DLS, and more.'
    },
    {
      path: '/stickers',
      icon: Image,
      title: 'Sticker Maker',
      description: 'Design 512x512 transparent stickers for WhatsApp.'
    },
    {
      path: '/card',
      icon: IdCard,
      title: 'Gamer ID Card',
      description: 'Generate and share your official gamer profile.'
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '32px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>App Tools</h1>
        <p className="text-secondary">Choose a tool to get started.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {tools.map((tool) => (
          <Link 
            key={tool.path} 
            to={tool.path} 
            className="card" 
            style={{ display: 'flex', alignItems: 'center', gap: '16px', textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <tool.icon size={24} strokeWidth={2} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '4px', fontSize: '16px' }}>{tool.title}</h3>
              <p className="text-secondary" style={{ fontSize: '14px', margin: 0 }}>{tool.description}</p>
            </div>
            <ArrowRight size={20} strokeWidth={2} color="var(--text-secondary)" />
          </Link>
        ))}
      </div>
    </div>
  );
}