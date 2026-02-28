import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    index: true,
  },
  username: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['message', 'reaction', 'system'],
    default: 'message',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
export default Message;
