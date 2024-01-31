import { cn } from "@/lib/utils";
import ChatList from "./Chat/ChatList";

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
  setCloseSideBar: (open: boolean) => void;
}

export default function Sidebar({
  isOpen,
  setCloseSideBar,
  setSidebarOpen,
  closeSidebar,
}: SidebarProps) {
  return (
    <div
      onMouseEnter={() => setCloseSideBar(false)}
      onMouseLeave={() => setCloseSideBar(true)}
      className={cn(
        closeSidebar ? "lg:w-20" : "lg:w-96",
        "duration-800 bottom-0 top-16 hidden transition-all ease-in-out lg:fixed lg:z-40 lg:flex lg:flex-col"
      )}
    >
      <div
        className={`flex grow flex-col gap-y-5 ${
          closeSidebar ? "overflow-y-hidden" : "overflow-auto"
        } overflow-x-hidden border border-gray-300 bg-background px-2 pb-4 dark:border-secondary`}
      >
        <div className="mt-4">
          <ChatList />
          <ChatList />
          <ChatList />
          <ChatList />
        </div>
      </div>
    </div>
  );
}
