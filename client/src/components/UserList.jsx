import { getAvatarColor, getInitial } from '../utils/avatarGenerator';

function UserList({ users }) {
  return (
    <div className="px-3 md:px-4 py-2.5 md:py-3 border-b border-white/5 bg-pitch-deep/30">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 bg-gradient-to-b from-cyber-cyan to-cyber-magenta rounded-full"></div>
          <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Viewers</h3>
        </div>
        <span className="text-[10px] text-accent font-bold font-mono">{users.length} online</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {users.map((user) => {
          const color = getAvatarColor(user.username);
          return (
            <div
              key={user.username}
              className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] px-2 py-1 md:px-2.5 md:py-1.5 rounded-full hover:bg-white/[0.06] transition-colors group"
              title={user.username}
            >
              <div
                className="w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold ring-1 ring-white/10"
                style={{ backgroundColor: color + '22', color }}
              >
                {getInitial(user.username)}
              </div>
              <span className="text-[10px] md:text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{user.username}</span>
              {user.isHost && (
                <span className="text-[8px] md:text-[10px] text-gold font-bold">HOST</span>
              )}
              <span className="w-1.5 h-1.5 bg-accent rounded-full shadow-neon"></span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserList;
