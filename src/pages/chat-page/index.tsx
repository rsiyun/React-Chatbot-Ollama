import { ChatMessage } from "@/components/ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
    role: "user" | "assistant";
    content: string;
  };

const ChatPage = () => {
    const handleSubmit = async () => {
        alert("chat");
      };
    const chatList: Message[] = [
        { role: "assistant", content: "Hello! How can I assist you today?" },
        { role: "user", content: "Hello world" },
        {
          role: "assistant",
          content:
            "Hello User",
        },
      ];
    return(
        <div className="flex flex-col flex-1">
          <header className="flex items-center px-4 h-16 border-primary bg-secondary border-b">
            <h1 className="text-xl font-bold ml-4">Naura Chatbot</h1>
          </header>
          <main className="flex-1 overflow-auto p-4 w-full">
            <div className="mx-auto space-y-4 pb-20 max-w-screen-md">
              {chatList.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
            </div>
          </main>
          <footer className="border-t bg-secondary p-4">
            <div className="max-w-3xl mx-auto flex gap-2 items-center">
              <Textarea
                className="flex-1 resize-none text-background"
                placeholder="Type your message here..."
                rows={5}
              />
              <Button onClick={handleSubmit} type="button">
                Send
              </Button>
            </div>
          </footer>
        </div>
    )
}
export default ChatPage;