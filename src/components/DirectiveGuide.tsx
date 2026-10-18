import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { playNotification } from '../lib/soundEngine';

export function DirectiveGuide() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      showMessage("👋 Welcome! Sign in to start earning Squard Coins.");
      return;
    }

    // Simple logic to guide the user based on their state
    const timer = setTimeout(() => {
      showMessage("💡 Tip: Go to the Lobby to challenge friends and win coins!");
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setIsVisible(true);
    playNotification(); // Play a subtle sound to grab attention
    
    // Auto-hide after 5 seconds
    setTimeout(() => setIsVisible(false), 5000);
  };

  if (!isVisible || !message) return null;

  return (
    <div className="directive-tooltip">
      <span>{message}</span>
    </div>
  );
}