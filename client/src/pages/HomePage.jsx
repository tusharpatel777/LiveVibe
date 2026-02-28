import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { classifyVideoUrl } from '../utils/videoClassifier';

function HomePage() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState('');
  const [username, setUsername] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinUsername, setJoinUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const urlCheck = videoUrl ? classifyVideoUrl(videoUrl) : null;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!videoUrl || !username) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create room');
        return;
      }

      sessionStorage.setItem('username', username);
      sessionStorage.setItem('isHost', 'true');
      setShareLink(`${window.location.origin}/room/${data.roomId}`);
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();
    if (!joinRoomId || !joinUsername) return;
    sessionStorage.setItem('username', joinUsername);
    sessionStorage.removeItem('isHost');
    navigate(`/room/${joinRoomId}`);
  };

  const goToRoom = () => {
    const roomId = shareLink.split('/room/')[1];
    navigate(`/room/${roomId}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-pitch-deep cyber-grid flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight">
            <span className="text-white">Live</span>
            <span className="gradient-text">Match</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-lg">Watch together. React together. Win together.</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="live-badge flex items-center gap-1.5 bg-hot/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-hot rounded-full animate-pulse-live"></span>
              <span className="text-hot text-xs font-bold uppercase tracking-wider">Live Watch Party</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-8">
          {/* Create Room */}
          <div className="glass-strong rounded-2xl p-5 md:p-8 neon-border animate-slide-up">
            <div className="flex items-center gap-2 mb-5 md:mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-accent to-cyber-cyan rounded-full"></div>
              <h2 className="text-lg md:text-2xl font-bold text-white">Create Watch Party</h2>
            </div>

            {!shareLink ? (
              <form onSubmit={handleCreate} className="space-y-4 md:space-y-5">
                <div>
                  <label className="block text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Your Name</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-pitch-light/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:shadow-neon transition-all"
                    required
                    maxLength={20}
                  />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Match / Video URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Paste YouTube, Twitch, or stream URL"
                    className="w-full bg-pitch-light/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:shadow-neon transition-all"
                    required
                  />
                  {urlCheck && (
                    <p className={`text-xs mt-2 flex items-center gap-1.5 ${urlCheck.isValid ? 'text-accent' : 'text-hot'}`}>
                      {urlCheck.isValid ? (
                        <><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>{urlCheck.label}</>
                      ) : urlCheck.error}
                    </p>
                  )}
                </div>
                {error && <p className="text-hot text-xs flex items-center gap-1.5"><svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !urlCheck?.isValid}
                  className="w-full bg-accent text-pitch-deep font-bold py-3 rounded-xl hover:shadow-neon-strong transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-pitch-deep border-t-transparent rounded-full animate-spin"></span>
                      Creating...
                    </span>
                  ) : 'Create Watch Party'}
                </button>
              </form>
            ) : (
              <div className="space-y-4 md:space-y-5 animate-fade-in">
                <div className="flex items-center gap-2 text-accent text-sm font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                  Arena created!
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Share this link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 bg-pitch-light/50 border border-white/10 rounded-xl px-3 md:px-4 py-3 text-accent text-xs font-mono"
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        copied
                          ? 'bg-accent/20 text-accent border border-accent/30'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <button
                  onClick={goToRoom}
                  className="w-full bg-accent text-pitch-deep font-bold py-3 rounded-xl hover:shadow-neon-strong transition-all active:scale-[0.98] text-sm"
                >
                  Enter Arena
                </button>
              </div>
            )}
          </div>

          {/* Join Room */}
          <div className="glass-strong rounded-2xl p-5 md:p-8 neon-border animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-5 md:mb-6">
              <div className="w-1.5 h-6 bg-gradient-to-b from-cyber-cyan to-cyber-magenta rounded-full"></div>
              <h2 className="text-lg md:text-2xl font-bold text-white">Join Watch Party</h2>
            </div>
            <form onSubmit={handleJoin} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Your Name</label>
                <input
                  type="text"
                  value={joinUsername}
                  onChange={(e) => setJoinUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-pitch-light/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 focus:shadow-neon-cyan transition-all"
                  required
                  maxLength={20}
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Room Code</label>
                <input
                  type="text"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  placeholder="Enter 6-character room code"
                  className="w-full bg-pitch-light/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 focus:shadow-neon-cyan transition-all font-mono tracking-widest"
                  required
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={!joinRoomId || !joinUsername}
                className="w-full bg-transparent border-2 border-cyber-cyan text-cyber-cyan font-bold py-3 rounded-xl hover:bg-cyber-cyan/10 hover:shadow-neon-cyan transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] text-sm"
              >
                Join Arena
              </button>
            </form>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="text-center mt-8 md:mt-10 animate-fade-in">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500">
            {['YouTube', 'Twitch', 'Dailymotion', 'HLS (.m3u8)', 'Direct Video'].map((platform) => (
              <span key={platform} className="bg-white/[0.03] border border-white/[0.06] px-2.5 py-1 rounded-full">{platform}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
