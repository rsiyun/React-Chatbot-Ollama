import { db } from '@/lib/dexie';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useState } from 'react';

export function useOllamaStream() {
  const [streamedMessage, setStreamedMessage] = useState('');
  const [streamedThought, setStreamedThought] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  // const [outputMode, setOutPutMode] = useState<"think"|"response">("think");

  const streamMessage = async (messageInput: string) => {
    setIsLoading(true);
    setError(null);
    setStreamedMessage(''); // Clear previous message

    // const requestOptions = ;

    try {
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1:1.5b",
          messages: [
            {
              role: "user",
              content: messageInput,
            },
          ],
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullthought = "";
      let outputMode: "think"|"response" = "think";
      let fullmessage = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        
        try {
          const chunk = decoder.decode(value, { stream: true });
          const jsonObjects = chunk.split("\n").filter((line) => line.trim() !== "");
          jsonObjects.forEach((json) => {
            const parsed = JSON.parse(json);
            const {content, role} = parsed.message
            if (parsed) {
              if(outputMode == "think"){
                fullthought += content
                setStreamedThought(fullthought);
                if(content.includes("</think>")){
                  outputMode = "response"
                }
              }else{
                fullmessage += content
                setStreamedMessage(fullmessage);
              }
            }
          });
          // const parsed = JSON.parse(chunk);
        } catch (parseError) {
          console.error('Error parsing chunk:', parseError);
          setError('Error processing stream data');
        }
      }
      await db.createMessage({content: fullmessage, role: "assistant", chat_id: pathname.split("/")[2] as string, thought: fullthought})
      setStreamedThought("")
      setStreamedMessage("")
    } catch (error) {
      console.error('Error fetching stream:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stream');
    } finally {
      setIsLoading(false);
    }
  };


  return { streamMessage, streamedMessage,streamedThought, isLoading, error };
}