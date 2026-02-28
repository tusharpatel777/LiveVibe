import { useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';
import { useRoom } from '../context/RoomContext';

function VideoPlayer({ videoUrl, videoType }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const { isHost, videoState, hostPlay, hostPause, hostSeek } = useRoom();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (videoType !== 'hls' || !videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);
      hlsRef.current = hls;
      return () => hls.destroy();
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = videoUrl;
    }
  }, [videoUrl, videoType]);

  const handlePlay = useCallback(() => {
    if (isHost && !isSyncingRef.current) {
      hostPlay(videoRef.current.currentTime);
    }
  }, [isHost, hostPlay]);

  const handlePause = useCallback(() => {
    if (isHost && !isSyncingRef.current) {
      hostPause(videoRef.current.currentTime);
    }
  }, [isHost, hostPause]);

  const handleSeeked = useCallback(() => {
    if (isHost && !isSyncingRef.current) {
      hostSeek(videoRef.current.currentTime);
    }
  }, [isHost, hostSeek]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isHost || videoType === 'iframe') return;

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [isHost, videoType, handlePlay, handlePause, handleSeeked]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isHost || videoType === 'iframe') return;

    isSyncingRef.current = true;
    video.currentTime = videoState.currentTime;
    if (videoState.isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
    setTimeout(() => { isSyncingRef.current = false; }, 200);
  }, [videoState, isHost, videoType]);

  if (videoType === 'iframe') {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media; fullscreen"
          title="Live Stream"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black relative">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        src={videoType === 'direct' ? videoUrl : undefined}
        playsInline
      />

      {/* Sync Badge - Cyberpunk Style */}
      {!isHost && videoType !== 'iframe' && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1.5 glass px-2.5 py-1 rounded-full text-[10px] md:text-xs z-20">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-live"></span>
          <span className="text-accent font-semibold">Synced</span>
        </div>
      )}

      {/* Host Badge */}
      {isHost && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex items-center gap-1.5 glass px-2.5 py-1 rounded-full text-[10px] md:text-xs z-20">
          <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          <span className="text-gold font-semibold">Host</span>
          <span className="text-gray-500">|</span>
          <span className={`font-semibold ${videoState.isPlaying ? 'text-accent' : 'text-gray-400'}`}>
            {videoState.isPlaying ? 'Playing' : 'Paused'}
          </span>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
