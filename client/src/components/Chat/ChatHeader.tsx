import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { X } from 'lucide-react';

function ChatHeader() {
  const selectedUser = useChat().selectedUser;
  const setSelectedUser = useChat().setSelectedUser;
  const onlineUsers = useAuth().onlineUsers;

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser?.avatar || '/avatar.png'}
                alt={selectedUser?.username}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.username}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.some(
                (onlineUser) => onlineUser.id === selectedUser?.id
              )
                ? 'Online'
                : 'Offline'}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
}
export default ChatHeader;
