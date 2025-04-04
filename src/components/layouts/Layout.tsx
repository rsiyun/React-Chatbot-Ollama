import { useState } from "react";
import { SidebarProvider } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { ChatSidebar } from "../ChatSidebar";

export default function Layout({children}:{children:any}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
  
    const handleSubmit = async () => {
      alert("chat");
    };
  
    return (
      <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-white"></div>
        <div className="flex h-screen z-20 w-full">
          <ChatSidebar />
          {children}
        </div>
      </SidebarProvider>
    );
  }