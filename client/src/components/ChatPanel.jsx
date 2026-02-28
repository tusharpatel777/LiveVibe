import { useState, useRef, useEffect, useCallback } from 'react';
import { useRoom } from '../context/RoomContext';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';

function ChatPanel() {
  const { messages, sendMessage, startTyping, stopTyping, typingUsers } = useRoom();
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTyping = useCallback((value) => {
    if (value) {
      startTyping();
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => stopTyping(), 2000);
    } else {
      stopTyping();
    }
  }, [startTyping, stopTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
    stopTyping();
    clearTimeout(typingTimeoutRef.current);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    handleTyping(e.target.value);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Chat Header */}
      <div className="px-4 py-2.5 md:py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-accent to-cyber-cyan rounded-full"></div>
          <h3 className="text-xs md:text-sm font-bold text-gray-300 uppercase tracking-widest">Live Chat</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-live"></span>
          <span className="text-[10px] text-gray-500 font-mono">{messages.length} msgs</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 space-y-0.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
            <svg className="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 text-xs text-center">Start the conversation</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg._id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-2.5 md:p-3 border-t border-white/5">
        <div className={`flex gap-2 p-1 rounded-xl transition-all duration-300 ${
          isFocused
            ? 'bg-pitch-light/80 shadow-neon'
            : 'bg-pitch-light/50'
        }`}>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="relative px-4 md:px-5 py-2.5 bg-accent text-pitch-deep font-bold text-sm rounded-lg hover:shadow-neon-strong transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
          >
            <span className="relative z-10">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatPanel;
