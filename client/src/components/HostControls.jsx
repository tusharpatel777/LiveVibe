import { useRoom } from '../context/RoomContext';

function HostControls() {
  const { isHost, videoState } = useRoom();

  if (!isHost) return null;

  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
      <span className="text-gold font-semibold">HOST</span>
      <span className="text-gray-400">|</span>
      <span className={`font-semibold ${videoState.isPlaying ? 'text-accent' : 'text-gray-400'}`}>
        {videoState.isPlaying ? 'Playing' : 'Paused'}
      </span>
    </div>
  );
}

export default HostControls;
