export function getAvatarColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `#${((hash >> 0) & 0xFFFFFF).toString(16).padStart(6, '0')}`;
}

export function getInitial(username) {
  return username ? username.charAt(0).toUpperCase() : '?';
}
