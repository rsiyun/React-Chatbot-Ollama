// import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
// "use client"
// import { MDXRemote } from 'next-mdx-remote/rsc'
import Markdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
  }
  export const ChatMessage = (props: ChatMessageProps) => {
    const isAssistant = props.role === "assistant";
    return (
      <div
        className={`flex items-start gap-4 ${
          isAssistant ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div
          className={` rounded-lg p-4 max-w-[80%] ${
            isAssistant
              ? "bg-secondary marker:text-white prose dark:prose-invert text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          <Markdown>{props.content.trim()}</Markdown>
        </div>
      </div>
    );
  };