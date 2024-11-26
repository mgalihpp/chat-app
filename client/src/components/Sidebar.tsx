import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { User } from '@/types/auth';
import { Users } from 'lucide-react';
import { useState } from 'react';
import { useFetcher, useLoaderData } from 'react-router-dom';

function Sidebar() {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const fetcher = useFetcher({ key: 'chat' });

  const onlineUsers = useAuth().onlineUsers;
  const selectedUser = useChat().selectedUser;
  const setSelectedUser = useChat().setSelectedUser;
  const { users } = useLoaderData<{ users: User[] }>();

  const filteredUsers = showOnlineOnly
    ? users.filter((user) =>
        onlineUsers.some((onlineUser) => onlineUser.id === user.id)
      )
    : users;

  console.log(fetcher.data);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        {/* TODO: Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label
            htmlFor="filter"
            className="cursor-pointer flex items-center gap-2"
          >
            <input
              type="checkbox"
              name="filter"
              id="filter"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <fetcher.Form
            key={user.id}
            action={`/chat/${selectedUser?.id}`}
            method="get"
          >
            <button
              type="submit"
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-base-300 ring-1 ring-base-300'
                  : ''
              }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.avatar}
                  alt={user.username + 'avatar'}
                  className="rounded-full size-12 object-cover"
                />
                {onlineUsers.some(
                  (onlineUser) => onlineUser.id === user.id
                ) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.username}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.some((onlineuser) => onlineuser.id === user.id)
                    ? 'Online'
                    : 'Offline'}
                </div>
              </div>
            </button>
          </fetcher.Form>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
