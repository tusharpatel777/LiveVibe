import { getAvatarColor, getInitial } from '../utils/avatarGenerator';

function ChatMessage({ message }) {
  const { username, content, timestamp, type } = message;
  const color = getAvatarColor(username);

  if (type === 'reaction') {
    return (
      <div className="flex items-center gap-2 py-1 animate-slide-in">
        <span className="text-xs font-medium" style={{ color }}>{username}</span>
        <span className="text-[10px] text-gray-600">reacted</span>
        <span className="text-base animate-bounce-in">{content}</span>
      </div>
    );
  }

  if (type === 'system') {
    return (
      <div className="flex items-center justify-center gap-2 py-1.5 my-1 animate-fade-in">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <span className="text-[10px] text-gray-500 font-medium px-2">{content}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>
    );
  }

  const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex gap-2.5 py-1.5 animate-slide-in group hover:bg-white/[0.02] rounded-lg px-1 -mx-1 transition-colors">
      {/* Avatar with glow ring */}
      <div className="relative flex-shrink-0 mt-0.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ring-1 ring-white/10"
          style={{ backgroundColor: color + '22', color }}
        >
          {getInitial(username)}
        </div>
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: `0 0 8px ${color}40` }}
        ></div>
      </div>

      {/* Message Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xs md:text-sm font-semibold" style={{ color }}>{username}</span>
          <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono">{time}</span>
        </div>
        <p className="text-xs md:text-sm text-gray-300 break-words leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

export default ChatMessage;
