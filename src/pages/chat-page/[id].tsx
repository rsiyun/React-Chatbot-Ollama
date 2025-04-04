import { ChatMessage } from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useOllamaStream } from "@/hooks/useOllamaStream";
import { db } from "@/lib/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";


const ChatPage = () => {
  const [messageInput, setMessageInput] = useState<string>("")
  const { streamMessage, streamedMessage, streamedThought, isLoading, error } = useOllamaStream();
  const scrolltoBottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const handleSubmit = async () => {
    if(isLoading){
      return;
    }
    if(!isLoading){
      setMessageInput("")
      await db.createMessage({content: messageInput, role: "user", chat_id: router.query.id as string, thought: ""})
      await streamMessage(messageInput)
    }
  };
  const messages = useLiveQuery(()=>{
    if(!router.query.id){return}
    return db.getMessageForChat(router.query.id as string)
  },[router.query.id])

  const handleScrollToBottom = () =>{
    scrolltoBottomRef.current?.scrollIntoView();
  }

  useLayoutEffect(()=>{
    handleScrollToBottom()
  },[streamedMessage, messages])

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center px-4 h-16 border-primary bg-secondary border-b">
        <h1 className="text-xl font-bold ml-4">Naura Chatbot</h1>
      </header>
      <main className="flex-1 overflow-auto p-4 w-full">
        <div className="mx-auto space-y-4 pb-20 max-w-screen-md">
          {messages?.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
            />
          ))}
          {!!streamedMessage && (
            <ChatMessage role="assistant" content={streamedMessage} />
          )}

          <div ref={scrolltoBottomRef}></div>
          
        </div>
      </main>
      <footer className="border-t bg-background p-4">
        <form onSubmit={handleSubmit}>
          <div className="max-w-3xl mx-auto flex gap-2 items-center">
            <Textarea
            value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 resize-none text-background"
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              rows={5}
            />
            <Button type="submit">
              Send
            </Button>
          </div>
        </form>
      </footer>
    </div>
  )
}
export default ChatPage;