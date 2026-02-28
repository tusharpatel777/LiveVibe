import { useEffect, useState } from 'react';

function FloatingReaction({ reaction, onComplete }) {
  const [left] = useState(() => 10 + Math.random() * 80);
  const [rotate] = useState(() => -15 + Math.random() * 30);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="floating-reaction"
      style={{
        left: `${left}%`,
        bottom: '60px',
        '--rotate': `${rotate}deg`,
      }}
    >
      {reaction}
    </div>
  );
}

export default FloatingReaction;
