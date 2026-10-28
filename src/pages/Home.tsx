import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Send, Link as LinkIcon, Gem, Trophy, ShoppingCart } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useFeed } from '../hooks/useFeed';
import { WhatsAppCheckout } from '../components/WhatsAppCheckout';

const getEmbedUrl = (url: string) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return url;
};

export function Home() {
  const { data: profile } = useProfile();
  const { posts, isLoading, createPostMutation } = useFeed();
  const [postContent, setPostContent] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [checkoutType, setCheckoutType] = useState<'diamonds' | 'accounts' | null>(null);

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !videoLink.trim()) return;
    createPostMutation.mutate({ content: postContent, videoLink }, { onSuccess: () => { setPostContent(''); setVideoLink(''); } });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return 'Today';
    if (diffInSeconds < 86400) return 'Today';
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Discord-style Header */}
      <div className="content-header">
        <Hash size={24} color="var(--text-muted)" />
        <h1 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--header-primary)' }}>general</h1>
        <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 8px' }} />
        <span className="text-muted" style={{ fontSize: '14px', fontWeight: '500' }}>Welcome to the Squard Hub feed!</span>
      </div>

      <div className="content-body" style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        
        {/* Market Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => setCheckoutType('diamonds')} className="btn btn-primary" style={{ justifyContent: 'flex-start', padding: '12px' }}>
            <Gem size={18} /> <span>Buy Diamonds & UC</span>
          </button>
          <Link to="/squads" className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px', textDecoration: 'none', color: 'inherit' }}>
            <Trophy size={18} /> <span>Tournaments</span>
          </Link>
          <button onClick={() => setCheckoutType('accounts')} className="btn btn-secondary" style={{ justifyContent: 'flex-start', padding: '12px' }}>
            <ShoppingCart size={18} /> <span>Trade Accounts</span>
          </button>
        </div>

        {/* Create Post Input */}
        <form onSubmit={handlePost} style={{ display: 'flex', gap: '12px', marginBottom: '24px', alignItems: 'flex-end' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#000', flexShrink: 0 }}>
            {profile?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              className="input" 
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              placeholder={`Message #general`}
              style={{ minHeight: '40px' }}
            />
            {postContent.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" value={videoLink} onChange={e => setVideoLink(e.target.value)}
                    placeholder="Paste YouTube/TikTok link (Optional)"
                    className="input" style={{ paddingLeft: '36px', minHeight: '36px', fontSize: '13px' }}
                  />
                </div>
                <button type="submit" disabled={createPostMutation.isPending} className="btn btn-primary" style={{ minHeight: '36px', padding: '0 16px' }}>
                  <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Feed Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {isLoading ? <p className="text-muted" style={{ textAlign: 'center' }}>Loading...</p> : posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
              <p>Welcome to #general! Be the first to send a message.</p>
            </div>
          ) : (
            posts.map((post) => {
              const embedUrl = getEmbedUrl(post.video_link || '');
              return (
                <div key={post.id} style={{ display: 'flex', gap: '16px', padding: '4px 16px', borderRadius: '4px', transition: 'background 0.1s' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-modifier-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: '#000', flexShrink: 0, marginTop: '2px' }}>
                    {post.profiles?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--header-primary)', fontSize: '15px' }}>{post.profiles?.username || 'Unknown'}</span>
                      <span className="text-xs" style={{ fontSize: '12px' }}>{formatTime(post.created_at)} at {new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    {post.content && <p style={{ fontSize: '15px', lineHeight: '1.4', color: 'var(--text-normal)', whiteSpace: 'pre-wrap', marginBottom: embedUrl ? '8px' : '0' }}>{post.content}</p>}
                    {embedUrl && (
                      <div style={{ borderRadius: '8px', overflow: 'hidden', maxWidth: '400px', aspectRatio: '16/9', background: '#000' }}>
                        <iframe src={embedUrl} title="Video" style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <WhatsAppCheckout isOpen={checkoutType === 'diamonds'} onClose={() => setCheckoutType(null)} type="diamonds" />
      <WhatsAppCheckout isOpen={checkoutType === 'accounts'} onClose={() => setCheckoutType(null)} type="accounts" />
    </>
  );
}