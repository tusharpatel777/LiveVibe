import { useState } from 'react';
import { useRoom } from '../context/RoomContext';

const REACTIONS = [
  { key: 'lol', emoji: '\u{1F602}', label: 'LOL' },
  { key: 'fire', emoji: '\u{1F525}', label: 'Fire!' },
  { key: 'ohno', emoji: '\u{1F631}', label: 'OMG' },
  { key: 'clap', emoji: '\u{1F44F}', label: 'GG' },
  { key: 'angry', emoji: '\u{1F621}', label: 'Rage' },
];

function EmojiReactions() {
  const { sendReaction } = useRoom();
  const [lastClicked, setLastClicked] = useState(null);

  const handleReaction = (emoji, key) => {
    sendReaction(emoji);
    setLastClicked(key);
    setTimeout(() => setLastClicked(null), 300);
  };

  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 bg-pitch-deep/80 border-t border-white/5">
      {REACTIONS.map((r) => (
        <button
          key={r.key}
          onClick={() => handleReaction(r.emoji, r.key)}
          className={`flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 py-1.5 rounded-full border transition-all duration-200 group active:scale-90 ${
            lastClicked === r.key
              ? 'bg-accent/15 border-accent/40 shadow-neon scale-105'
              : 'bg-white/[0.03] border-white/[0.06] hover:border-accent/30 hover:bg-accent/5'
          }`}
          title={r.label}
        >
          <span className={`text-base md:text-lg transition-transform duration-200 ${
            lastClicked === r.key ? 'scale-125' : 'group-hover:scale-110'
          }`}>{r.emoji}</span>
          <span className="text-[10px] md:text-xs text-gray-500 group-hover:text-gray-300 transition-colors hidden sm:inline font-medium">{r.label}</span>
        </button>
      ))}
    </div>
  );
}

export default EmojiReactions;
