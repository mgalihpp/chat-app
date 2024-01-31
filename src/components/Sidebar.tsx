import { cn } from "@/lib/utils";
import ChatList from "./Chat/ChatList";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
  setCloseSideBar: (open: boolean) => void;
}

interface User {
  username: string | null;
  photoUrl: string | null;
  email: string | null;
  uid: string;
}

export default function Sidebar({
  isOpen,
  setCloseSideBar,
  setSidebarOpen,
  closeSidebar,
}: SidebarProps) {
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const fetchedData: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        fetchedData.push({
          uid: doc.id,
          ...data,
        } as User);
      });
      setUserList(fetchedData);
    });

    return () => unsubscribe();
  }, []);

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
          {userList.map((user) => (
            <Link key={user.uid} to={`/${user.uid}`}>
              <ChatList user={user} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
