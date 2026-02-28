function TypingIndicator({ users }) {
  if (!users || users.length === 0) return null;

  const text = users.length === 1
    ? `${users[0]} is typing`
    : users.length === 2
      ? `${users[0]} and ${users[1]} are typing`
      : `${users[0]} and ${users.length - 1} others are typing`;

  return (
    <div className="px-3 md:px-4 py-1.5 flex items-center gap-2 animate-fade-in">
      <span className="flex gap-0.5">
        <span className="typing-dot w-1 h-1 bg-accent/60 rounded-full inline-block"></span>
        <span className="typing-dot w-1 h-1 bg-accent/60 rounded-full inline-block"></span>
        <span className="typing-dot w-1 h-1 bg-accent/60 rounded-full inline-block"></span>
      </span>
      <span className="text-[10px] md:text-xs text-gray-500 font-medium">{text}</span>
    </div>
  );
}

export default TypingIndicator;
