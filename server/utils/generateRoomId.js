import crypto from 'crypto';

export function generateRoomId() {
  return crypto.randomBytes(4).toString('base64url').slice(0, 6);
}
