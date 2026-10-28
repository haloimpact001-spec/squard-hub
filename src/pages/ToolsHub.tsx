import { Link } from 'react-router-dom';
import { Type, Image, IdCard, ArrowRight, Gem } from 'lucide-react';

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
  const premiumPacks = [
    {
      id: 'pro-names',
      title: '500+ Exclusive Pro Names',
      description: 'Unlock hidden, ultra-rare stylish names for Free Fire & CODM.',
      price: 50,
      icon: Gem,
      locked: true // In a real app, check if user owns this
    },
    {
      id: 'pro-stickers',
      title: 'Premium Sticker Templates',
      description: '10 exclusive, pre-designed transparent sticker layouts.',
      price: 100,
      icon: Image,
      locked: true
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
            {/* PREMIUM DIGITAL PRODUCTS (Automated Revenue) */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '24px', marginTop: '24px' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Gem size={20} color="var(--accent)" /> Premium Digital Packs
        </h2>
        <p className="text-muted" style={{ fontSize: '14px', marginBottom: '16px' }}>
          Unlock exclusive content instantly using your Squard Coins. No manual approval needed.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          {premiumPacks.map((pack) => (
            <div key={pack.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                <pack.icon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '4px', fontSize: '15px' }}>{pack.title}</h3>
                <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>{pack.description}</p>
              </div>
              <button className="btn btn-primary" style={{ padding: '0 16px', minHeight: '36px', fontSize: '13px' }}>
                Unlock for {pack.price} 🪙
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}