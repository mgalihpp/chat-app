import NoSelectedChat from '@/components/Chat/NoSelectedChat';
import MessageSkeleton from '@/components/Skeleton/MessageSkeleton';
import SidebarSkeleton from '@/components/Skeleton/SidebarSkeleton';
import { useChat } from '@/hooks/useChat';
import { lazy, Suspense } from 'react';

const Sidebar = lazy(() => import('@/components/Sidebar'));
const ChatContainer = lazy(() => import('@/components/Chat/ChatContainer'));

function HomePage() {
  const selectedUser = useChat().selectedUser;

  return (
    <div className="min-h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)] ">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Suspense fallback={<SidebarSkeleton />}>
              <Sidebar />
            </Suspense>

            {/* Content */}
            {!selectedUser ? (
              <NoSelectedChat />
            ) : (
              <Suspense fallback={<MessageSkeleton />}>
                <ChatContainer />
              </Suspense>
            )}
            {/* Content */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
