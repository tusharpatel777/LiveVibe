import Message from '../models/Message.js';
import Room from '../models/Room.js';

const roomUsers = new Map();
const roomVideoState = new Map();
// Grace period timers - prevents room death on page refresh
const roomCleanupTimers = new Map();

const ROOM_GRACE_PERIOD_MS = 30_000; // 30 seconds

const getAvatarColor = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `#${((hash >> 0) & 0xFFFFFF).toString(16).padStart(6, '0')}`;
};

const getRoomUsersList = (roomId) => {
  const users = roomUsers.get(roomId);
  if (!users) return [];
  return Array.from(users.values()).map((u) => ({
    username: u.username,
    avatar: u.avatar,
    isHost: u.isHost,
  }));
};

const handleSocketConnection = (io, socket) => {
  console.log('User connected:', socket.id);

  // JOIN ROOM
  socket.on('join-room', async ({ roomId, username }) => {
    try {
      const room = await Room.findOne({ roomId, isActive: true });
      if (!room) {
        socket.emit('error-message', { message: 'Room not found or inactive' });
        return;
      }

      // Cancel any pending cleanup timer (user reconnected after refresh)
      if (roomCleanupTimers.has(roomId)) {
        clearTimeout(roomCleanupTimers.get(roomId));
        roomCleanupTimers.delete(roomId);
        console.log(`Cancelled cleanup for room ${roomId} - user reconnected`);
      }

      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.username = username;

      if (!roomUsers.has(roomId)) {
        roomUsers.set(roomId, new Map());
      }

      // Host is recognized by matching hostUsername stored in DB
      const isHost = room.hostUsername === username;

      if (isHost) {
        room.hostId = socket.id;
        await room.save();
      }

      const avatar = getAvatarColor(username);
      roomUsers.get(roomId).set(socket.id, { username, avatar, isHost });

      if (!roomVideoState.has(roomId)) {
        roomVideoState.set(roomId, { isPlaying: false, currentTime: 0 });
      }

      const users = getRoomUsersList(roomId);
      const videoState = roomVideoState.get(roomId);

      socket.emit('room-joined', {
        room: {
          roomId: room.roomId,
          videoUrl: room.videoUrl,
          videoType: room.videoType,
          hostUsername: room.hostUsername,
        },
        users,
        videoState,
        isHost,
      });

      socket.to(roomId).emit('user-joined', { username, avatar, users });

      const recentMessages = await Message.find({ roomId })
        .sort({ timestamp: -1 })
        .limit(50)
        .lean();
      socket.emit('message-history', recentMessages.reverse());
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error-message', { message: 'Failed to join room' });
    }
  });

  // CHAT
  socket.on('send-message', async ({ roomId, username, avatar, content }) => {
    if (!content || !content.trim()) return;
    try {
      const msg = new Message({
        roomId,
        username,
        avatar,
        content: content.trim(),
        type: 'message',
      });
      await msg.save();
      io.to(roomId).emit('receive-message', {
        _id: msg._id.toString(),
        roomId,
        username,
        avatar,
        content: msg.content,
        type: 'message',
        timestamp: msg.timestamp,
      });
    } catch (error) {
      socket.emit('error-message', { message: 'Failed to send message' });
    }
  });

  // TYPING
  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', { username });
  });

  socket.on('stop-typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-stop-typing', { username });
  });

  // REACTIONS
  socket.on('send-reaction', async ({ roomId, username, reaction }) => {
    try {
      const msg = new Message({
        roomId,
        username,
        content: reaction,
        type: 'reaction',
      });
      await msg.save();
      io.to(roomId).emit('receive-reaction', {
        username,
        reaction,
        timestamp: msg.timestamp,
      });
    } catch (error) {
      console.error('Error sending reaction:', error);
    }
  });

  // VIDEO SYNC - Host controls
  socket.on('host-play', ({ roomId, currentTime }) => {
    const state = roomVideoState.get(roomId);
    if (state) {
      state.isPlaying = true;
      state.currentTime = currentTime;
    }
    socket.to(roomId).emit('sync-play', { currentTime });
  });

  socket.on('host-pause', ({ roomId, currentTime }) => {
    const state = roomVideoState.get(roomId);
    if (state) {
      state.isPlaying = false;
      state.currentTime = currentTime;
    }
    socket.to(roomId).emit('sync-pause', { currentTime });
  });

  socket.on('host-seek', ({ roomId, currentTime }) => {
    const state = roomVideoState.get(roomId);
    if (state) {
      state.currentTime = currentTime;
    }
    socket.to(roomId).emit('sync-seek', { currentTime });
  });

  // LATE JOINER SYNC
  socket.on('request-sync', ({ roomId }) => {
    const state = roomVideoState.get(roomId);
    if (state) {
      socket.emit('sync-state', state);
    }
  });

  // DELETE ROOM (host only)
  socket.on('delete-room', async ({ roomId }) => {
    try {
      const room = await Room.findOne({ roomId, isActive: true });
      if (!room) return;

      // Only the host can delete
      if (room.hostUsername !== socket.data.username) {
        socket.emit('error-message', { message: 'Only the host can close the room' });
        return;
      }

      // Mark room as inactive
      room.isActive = false;
      await room.save();

      // Notify all users in the room
      io.to(roomId).emit('room-deleted', { message: 'The host has closed this room' });

      // Clean up server state
      if (roomCleanupTimers.has(roomId)) {
        clearTimeout(roomCleanupTimers.get(roomId));
        roomCleanupTimers.delete(roomId);
      }
      roomUsers.delete(roomId);
      roomVideoState.delete(roomId);

      // Remove all sockets from the room
      const sockets = await io.in(roomId).fetchSockets();
      for (const s of sockets) {
        s.leave(roomId);
      }

      console.log(`Room ${roomId} closed by host ${socket.data.username}`);
    } catch (error) {
      console.error('Error deleting room:', error);
      socket.emit('error-message', { message: 'Failed to close room' });
    }
  });

  // DISCONNECT - with grace period for reconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    roomUsers.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        const { username } = users.get(socket.id);
        users.delete(socket.id);

        if (users.size === 0) {
          // Don't immediately kill the room - start a grace period
          // This allows page refresh without losing the room
          console.log(`Room ${roomId} empty - ${ROOM_GRACE_PERIOD_MS / 1000}s grace period started`);
          const timer = setTimeout(async () => {
            const currentUsers = roomUsers.get(roomId);
            if (!currentUsers || currentUsers.size === 0) {
              roomUsers.delete(roomId);
              roomVideoState.delete(roomId);
              roomCleanupTimers.delete(roomId);
              try {
                await Room.findOneAndUpdate({ roomId }, { isActive: false });
                console.log(`Room ${roomId} deactivated after grace period`);
              } catch (err) {
                console.error('Error deactivating room:', err);
              }
            }
          }, ROOM_GRACE_PERIOD_MS);
          roomCleanupTimers.set(roomId, timer);
        } else {
          const updatedUsers = getRoomUsersList(roomId);
          io.to(roomId).emit('user-left', { username, users: updatedUsers });
        }
      }
    });
  });
};

export default handleSocketConnection;
