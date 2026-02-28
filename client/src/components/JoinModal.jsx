import { useState } from 'react';

function JoinModal({ roomId, onJoin, onCancel }) {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) onJoin(name.trim());
  };

  return (
    <div className="min-h-screen bg-pitch-deep cyber-grid flex items-center justify-center p-4">
      <div className="glass-strong rounded-2xl p-6 md:p-8 w-full max-w-md animate-fade-in neon-border">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
            <span className="text-white">Live</span>
            <span className="gradient-text">Match</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">Enter the arena</p>
          <div className="inline-flex items-center gap-2 mt-2 bg-white/5 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-live"></span>
            <span className="text-xs text-gray-500 font-mono">Room #{roomId}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Your Name</label>
            <div className={`rounded-xl transition-all duration-300 ${isFocused ? 'shadow-neon' : ''}`}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your name..."
                className="w-full bg-pitch-light/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-all"
                required
                maxLength={20}
                autoFocus
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 bg-accent text-pitch-deep font-bold py-3 rounded-xl hover:shadow-neon-strong transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
            >
              Join Arena
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JoinModal;
