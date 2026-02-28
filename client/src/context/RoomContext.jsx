import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { useSocket } from './SocketContext';

const RoomContext = createContext(null);

const initialState = {
  room: null,
  users: [],
  messages: [],
  reactions: [],
  videoState: { isPlaying: false, currentTime: 0 },
  isHost: false,
  typingUsers: [],
  joined: false,
  error: null,
};

function roomReducer(state, action) {
  switch (action.type) {
    case 'ROOM_JOINED':
      return {
        ...state,
        room: action.payload.room,
        users: action.payload.users,
        videoState: action.payload.videoState,
        isHost: action.payload.isHost,
        joined: true,
        error: null,
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'UPDATE_USERS':
      return { ...state, users: action.payload };
    case 'ADD_REACTION':
      return { ...state, reactions: [...state.reactions, { ...action.payload, id: Date.now() + Math.random() }] };
    case 'REMOVE_REACTION':
      return { ...state, reactions: state.reactions.filter((r) => r.id !== action.payload) };
    case 'ADD_TYPING':
      if (state.typingUsers.includes(action.payload)) return state;
      return { ...state, typingUsers: [...state.typingUsers, action.payload] };
    case 'REMOVE_TYPING':
      return { ...state, typingUsers: state.typingUsers.filter((u) => u !== action.payload) };
    case 'SYNC_VIDEO':
      return { ...state, videoState: action.payload };
    case 'ROOM_DELETED':
      return { ...state, error: action.payload, joined: false, room: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function RoomProvider({ children, roomId, username }) {
  const socket = useSocket();
  const [state, dispatch] = useReducer(roomReducer, initialState);

  useEffect(() => {
    if (!socket || !roomId || !username) return;

    socket.emit('join-room', { roomId, username });

    socket.on('room-joined', (data) => {
      dispatch({ type: 'ROOM_JOINED', payload: data });
    });

    socket.on('message-history', (messages) => {
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    });

    socket.on('receive-message', (msg) => {
      dispatch({ type: 'ADD_MESSAGE', payload: msg });
    });

    socket.on('user-joined', ({ users }) => {
      dispatch({ type: 'UPDATE_USERS', payload: users });
    });

    socket.on('user-left', ({ users }) => {
      dispatch({ type: 'UPDATE_USERS', payload: users });
    });

    socket.on('receive-reaction', (reaction) => {
      dispatch({ type: 'ADD_REACTION', payload: reaction });
    });

    socket.on('user-typing', ({ username: typingUser }) => {
      dispatch({ type: 'ADD_TYPING', payload: typingUser });
    });

    socket.on('user-stop-typing', ({ username: typingUser }) => {
      dispatch({ type: 'REMOVE_TYPING', payload: typingUser });
    });

    socket.on('sync-play', ({ currentTime }) => {
      dispatch({ type: 'SYNC_VIDEO', payload: { isPlaying: true, currentTime } });
    });

    socket.on('sync-pause', ({ currentTime }) => {
      dispatch({ type: 'SYNC_VIDEO', payload: { isPlaying: false, currentTime } });
    });

    socket.on('sync-seek', ({ currentTime }) => {
      dispatch({ type: 'SYNC_VIDEO', payload: { isPlaying: state.videoState.isPlaying, currentTime } });
    });

    socket.on('sync-state', (videoState) => {
      dispatch({ type: 'SYNC_VIDEO', payload: videoState });
    });

    socket.on('error-message', ({ message }) => {
      dispatch({ type: 'SET_ERROR', payload: message });
    });

    socket.on('room-deleted', ({ message }) => {
      dispatch({ type: 'ROOM_DELETED', payload: message });
    });

    return () => {
      socket.off('room-joined');
      socket.off('message-history');
      socket.off('receive-message');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('receive-reaction');
      socket.off('user-typing');
      socket.off('user-stop-typing');
      socket.off('sync-play');
      socket.off('sync-pause');
      socket.off('sync-seek');
      socket.off('sync-state');
      socket.off('error-message');
      socket.off('room-deleted');
    };
  }, [socket, roomId, username]);

  const sendMessage = useCallback((content) => {
    if (socket && content.trim()) {
      socket.emit('send-message', { roomId, username, content });
    }
  }, [socket, roomId, username]);

  const sendReaction = useCallback((reaction) => {
    if (socket) {
      socket.emit('send-reaction', { roomId, username, reaction });
    }
  }, [socket, roomId, username]);

  const startTyping = useCallback(() => {
    if (socket) socket.emit('typing', { roomId, username });
  }, [socket, roomId, username]);

  const stopTyping = useCallback(() => {
    if (socket) socket.emit('stop-typing', { roomId, username });
  }, [socket, roomId, username]);

  const hostPlay = useCallback((currentTime) => {
    if (socket && state.isHost) {
      socket.emit('host-play', { roomId, currentTime });
    }
  }, [socket, roomId, state.isHost]);

  const hostPause = useCallback((currentTime) => {
    if (socket && state.isHost) {
      socket.emit('host-pause', { roomId, currentTime });
    }
  }, [socket, roomId, state.isHost]);

  const hostSeek = useCallback((currentTime) => {
    if (socket && state.isHost) {
      socket.emit('host-seek', { roomId, currentTime });
    }
  }, [socket, roomId, state.isHost]);

  const requestSync = useCallback(() => {
    if (socket) socket.emit('request-sync', { roomId });
  }, [socket, roomId]);

  const removeReaction = useCallback((id) => {
    dispatch({ type: 'REMOVE_REACTION', payload: id });
  }, []);

  const deleteRoom = useCallback(() => {
    if (socket && state.isHost) {
      socket.emit('delete-room', { roomId });
    }
  }, [socket, roomId, state.isHost]);

  return (
    <RoomContext.Provider value={{
      ...state,
      sendMessage,
      sendReaction,
      startTyping,
      stopTyping,
      hostPlay,
      hostPause,
      hostSeek,
      requestSync,
      removeReaction,
      deleteRoom,
    }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}
