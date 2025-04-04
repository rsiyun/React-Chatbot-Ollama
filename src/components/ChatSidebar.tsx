import { usePathname } from 'next/navigation'
import { Moon, Plus, Sun, Trash } from "lucide-react";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
} from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { db } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import Link from 'next/link';

const chatGroups = [
  { id: "1", name: "React Basics" },
  { id: "2", name: "AI Ethics" },
  { id: "3", name: "Climate Change" },
  { id: "4", name: "JavaScript Tips" },
  { id: "5", name: "Machine Learning Intro" },
];
export const ChatSidebar = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [textInput, setTextInput] = useState<string>("")
  const pathname = usePathname()

  const threads = useLiveQuery(() => db.getAllThreads(), [])

  const handleCreateChat = async () => {
    const threadId = await db.createChat(textInput);
    setDialogOpen(false);
    setTextInput("");
  }
  
  const handleDeleteThreads = async (id: string) => {
    await db.deleteThreads(id)
  }

  useLayoutEffect(() => {
    if (pathname) {
      setActiveChat(pathname.split("/")[2]);
    }
  }, [pathname])

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-secondary">
          <DialogHeader>
            <DialogTitle>Buat Chat baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-1">
            <Label htmlFor="thread-title">Judul Chat</Label>
            <Input
              type="text"
              id="thread-title"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant={"ghost"} onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateChat}>Buat Chat baru</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <SidebarPrimitive className="border-none">
        <SidebarHeader>
          <Button className="w-full justify-start" onClick={() => setDialogOpen(true)} variant="ghost">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
              <SidebarMenu>
                {threads?.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton isActive={activeChat === chat.id} className='px-3 py-5'>
                      <div className='justify-between w-full items-center flex'>
                        <Link href={`/chat-page/${chat.id}`}>
                          {chat.title}
                        </Link>
                        <span className='block hover:bg-sidebar p-2 rounded transition-all duration-300' onClick={(e) => {handleDeleteThreads(chat.id)}}>
                            <Trash className='h-4 w-4'/>
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarPrimitive>
    </>
  )
}

