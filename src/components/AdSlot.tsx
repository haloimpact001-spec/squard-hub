export function AdSlot() {
  return (
    <div 
      className="gamer-card"
      style={{ 
        width: '100%', 
        height: '90px', 
        borderStyle: 'dashed',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'var(--text-muted)',
        marginTop: '2rem',
        fontFamily: "'Orbitron', sans-serif",
        letterSpacing: '2px',
        textTransform: 'uppercase',
        fontSize: '0.9rem'
      }}
      role="complementary"
      aria-label="Advertisement space"
    >
      {/* TODO: Insert ad network script here (e.g., Google AdSense) */}
      Ad Space
    </div>
  );
}