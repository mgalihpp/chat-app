import { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

export default function Layout({ children }: PropsWithChildren) {
  const [sideBarOpen, setSideBarOpen] = useState(true);
  const [closeSidebar, setCloseSidebar] = useState(false);

  return (
    <>
      <Navbar />
      <Sidebar
        isOpen={sideBarOpen}
        setSidebarOpen={setSideBarOpen}
        closeSidebar={closeSidebar}
        setCloseSideBar={setCloseSidebar}
      />

      <div className={cn("lg:pl-96", { "lg:pl-20": closeSidebar })}>
        <main className="py-24">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-x-4">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
