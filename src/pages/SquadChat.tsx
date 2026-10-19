import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Flag } from 'lucide-react';
import { useMySquad } from '../hooks/useSquads';
import { useSquadChat } from '../hooks/useSquadChat';
import { useProfile } from '../hooks/useProfile';
import { playClick, playSuccess, playError } from '../lib/soundEngine';

export function SquadChat() {
  const { squad } = useMySquad();
  const { data: profile } = useProfile();
  const { messages, sendMessageMutation, reportMessageMutation } = useSquadChat(squad?.id);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || sendMessageMutation.isPending) return;
    playClick();
    sendMessageMutation.mutate(input, {
      onSuccess: () => { setInput(''); playSuccess(); },
      onError: () => playError()
    });
  };

  const handleReport = (messageId: string) => {
    if (window.confirm('Report this message for moderation?')) {
      playClick();
      reportMessageMutation.mutate(messageId);
    }
  };

  if (!squad) {
    return (
      <div className="container" style={{ paddingTop: '32px', textAlign: 'center' }}>
        <p className="text-secondary">You must be in a squad to chat.</p>
        <button onClick={() => navigate('/squads')} className="btn btn-primary" style={{ marginTop: '16px' }}>Go to Squads</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', maxWidth: '800px', margin: '0 auto', backgroundColor: '#0F1318' }}>
      {/* Header */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '0', borderBottom: '1px solid var(--border-subtle)', border: 'none', borderBottom: '1px solid var(--border-subtle)' }}>
        <button onClick={() => navigate('/squads')} className="btn btn-secondary" style={{ minWidth: '36px', height: '36px', padding: '0' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: '16px', margin: 0 }}>{squad.name}</h2>
          <p className="text-secondary" style={{ fontSize: '12px', margin: 0 }}>Squad Chat</p>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.length === 0 && (
          <p className="text-secondary" style={{ textAlign: 'center', marginTop: '32px' }}>No messages yet. Say hi!</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.user_id === profile?.id;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }}>
              {!isMe && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
                  {msg.profiles.username.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ maxWidth: '70%' }}>
                {!isMe && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '2px', marginLeft: '4px' }}>{msg.profiles.username}</p>}
                <div 
                  onContextMenu={(e) => { e.preventDefault(); handleReport(msg.id); }}
                  style={{ 
                    backgroundColor: isMe ? 'var(--accent)' : 'var(--bg-card)', 
                    color: isMe ? '#000' : '#fff',
                    padding: '10px 14px', 
                    borderRadius: '12px', 
                    borderBottomRightRadius: isMe ? '4px' : '12px',
                    borderBottomLeftRadius: isMe ? '12px' : '4px',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}
                >
                  {msg.content}
                </div>
                <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginTop: '4px' }}>
                  <button onClick={() => handleReport(msg.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }} title="Report message">
                    <Flag size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="card" style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '0', borderTop: '1px solid var(--border-subtle)', border: 'none', borderTop: '1px solid var(--border-subtle)' }}>
        <input 
          type="text" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Type a message..." 
          className="input" 
          style={{ flex: 1, minHeight: '44px' }}
          maxLength={1000}
        />
        <button type="submit" disabled={!input.trim() || sendMessageMutation.isPending} className="btn btn-primary" style={{ minWidth: '44px' }}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}