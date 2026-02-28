import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketProvider } from '../context/SocketContext';
import { RoomProvider, useRoom } from '../context/RoomContext';
import VideoPlayer from '../components/VideoPlayer';
import ChatPanel from '../components/ChatPanel';
import EmojiReactions from '../components/EmojiReactions';
import FloatingReaction from '../components/FloatingReaction';
import UserList from '../components/UserList';
import JoinModal from '../components/JoinModal';

function RoomContent() {
  const { room, users, isHost, reactions, removeReaction, joined, error, deleteRoom } = useRoom();
  const navigate = useNavigate();
  const [showUsers, setShowUsers] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  if (error) {
    return (
      <div className="min-h-screen bg-pitch-deep cyber-grid flex items-center justify-center p-4">
        <div className="glass-strong rounded-2xl p-8 text-center max-w-md neon-border animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-hot/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-hot" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-hot text-xl font-bold mb-2 text-glow-hot">Connection Error</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!joined || !room) {
    return (
      <div className="min-h-screen bg-pitch-deep cyber-grid flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-2 border-cyber-cyan/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-400 text-sm font-medium">Connecting to arena...</p>
        </div>
      </div>
    );
  }

  const handleCloseRoom = () => {
    deleteRoom();
    setShowCloseConfirm(false);
  };

  return (
    <div className="h-screen bg-pitch-deep flex flex-col overflow-hidden">
      {/* Close Room Confirmation Modal */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 max-w-sm w-full neon-border">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-hot/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-hot" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Close Room?</h3>
              <p className="text-gray-400 text-sm mb-5">This will end the watch party for everyone. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCloseConfirm(false)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCloseRoom}
                  className="flex-1 py-2.5 bg-hot/20 border border-hot/30 rounded-xl text-hot font-bold text-sm hover:bg-hot/30 transition-all"
                >
                  Close Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === TOP BAR - Glassmorphism Header === */}
      <div className="relative z-30 glass-strong border-b border-white/5">
        <div className="flex items-center justify-between px-3 py-2 md:px-5 md:py-2.5">
          {/* Left: Logo + Live */}
          <div className="flex items-center gap-2 md:gap-3">
            <h1 className="text-base md:text-lg font-extrabold tracking-tight">
              <span className="text-white">Live</span>
              <span className="gradient-text">Match</span>
            </h1>
            <div className="live-badge flex items-center gap-1.5 bg-hot/15 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-hot rounded-full animate-pulse-live"></span>
              <span className="text-[10px] md:text-xs text-hot font-bold uppercase tracking-wider">LIVE</span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {isHost && (
              <>
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] md:text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-full font-bold border border-accent/20 shadow-neon">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  HOST
                </span>
                <button
                  onClick={() => setShowCloseConfirm(true)}
                  className="flex items-center gap-1 text-[10px] md:text-xs text-hot/70 hover:text-hot px-2 py-1 rounded-full hover:bg-hot/10 transition-all"
                  title="Close Room"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="hidden sm:inline">Close</span>
                </button>
              </>
            )}
            <button
              onClick={() => setShowUsers(!showUsers)}
              className={`flex items-center gap-1.5 text-xs md:text-sm font-medium px-2.5 py-1.5 rounded-full transition-all duration-200 ${
                showUsers
                  ? 'bg-accent/15 text-accent border border-accent/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-2 h-2 bg-accent rounded-full shadow-neon"></span>
              <span>{users.length}</span>
              <span className="hidden sm:inline">online</span>
            </button>
            <span className="text-[10px] md:text-xs text-gray-500 font-mono bg-white/5 px-2 py-1 rounded-md">
              #{room.roomId}
            </span>
          </div>
        </div>
      </div>

      {/* === MAIN CONTENT - Mobile: Column, Desktop: Row === */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* === VIDEO SECTION === */}
        <div className="relative w-full md:flex-1 md:min-w-0 flex flex-col" style={{ minHeight: '30vh', maxHeight: '50vh', height: '40vh' }}>
          {/* Video Container with Scanline Effect */}
          <div className="relative flex-1 bg-black scanline overflow-hidden">
            {/* Cyberpunk Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-accent/40 z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan/40 z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-magenta/40 z-10 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-accent/40 z-10 pointer-events-none"></div>

            <VideoPlayer videoUrl={room.videoUrl} videoType={room.videoType} />

            {/* Floating Reactions Over Video */}
            {reactions.map((r) => (
              <FloatingReaction key={r.id} reaction={r.reaction} onComplete={() => removeReaction(r.id)} />
            ))}

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-pitch-deep/80 to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Emoji Reaction Bar */}
          <EmojiReactions />
        </div>

        {/* Desktop: Remove fixed height on video section */}
        <style>{`
          @media (min-width: 768px) {
            .md\\:flex-1 { min-height: 0 !important; max-height: none !important; height: auto !important; }
          }
        `}</style>

        {/* === CHAT SIDEBAR / MOBILE BOTTOM SECTION === */}
        <div className="flex-1 md:w-80 lg:w-96 md:flex-none flex flex-col border-t md:border-t-0 md:border-l border-white/5 bg-pitch-deep/50 overflow-hidden min-h-0">
          {/* User List (Collapsible) */}
          {showUsers && (
            <div className="animate-slide-up">
              <UserList users={users} />
            </div>
          )}
          {/* Chat Panel */}
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}

function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');
  const [showModal, setShowModal] = useState(!username);

  const handleJoin = (name) => {
    sessionStorage.setItem('username', name);
    setUsername(name);
    setShowModal(false);
  };

  if (showModal) {
    return <JoinModal roomId={roomId} onJoin={handleJoin} onCancel={() => navigate('/')} />;
  }

  return (
    <SocketProvider>
      <RoomProvider roomId={roomId} username={username}>
        <RoomContent />
      </RoomProvider>
    </SocketProvider>
  );
}

export default RoomPage;
