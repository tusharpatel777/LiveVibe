import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  hostId: {
    type: String,
    default: '',
  },
  hostUsername: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  videoType: {
    type: String,
    enum: ['hls', 'iframe', 'direct'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

roomSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 86400 });

const Room = mongoose.model('Room', roomSchema);
export default Room;
