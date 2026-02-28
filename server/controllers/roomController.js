import Room from '../models/Room.js';
import { classifyVideoUrl } from '../utils/videoClassifier.js';
import { generateRoomId } from '../utils/generateRoomId.js';

export const createRoom = async (req, res) => {
  try {
    const { videoUrl, username } = req.body;

    if (!videoUrl || !username) {
      return res.status(400).json({ error: 'Video URL and username are required' });
    }

    const domain = process.env.CLIENT_DOMAIN || 'localhost';
    const classification = classifyVideoUrl(videoUrl, domain);
    if (!classification.isValid) {
      return res.status(400).json({ error: classification.error });
    }

    let roomId;
    let exists = true;
    while (exists) {
      roomId = generateRoomId();
      exists = await Room.findOne({ roomId });
    }

    const room = new Room({
      roomId,
      hostUsername: username,
      videoUrl: classification.embedUrl,
      videoType: classification.type,
    });
    await room.save();

    res.status(201).json({
      roomId: room.roomId,
      videoUrl: room.videoUrl,
      videoType: room.videoType,
      shareLink: `/room/${room.roomId}`,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId, isActive: true });
    if (!room) {
      return res.status(404).json({ error: 'Room not found or inactive' });
    }
    res.json({
      roomId: room.roomId,
      hostUsername: room.hostUsername,
      videoUrl: room.videoUrl,
      videoType: room.videoType,
      isActive: room.isActive,
      createdAt: room.createdAt,
    });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};
