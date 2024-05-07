'use client'
import Link from "next/link";
import React, { useState, FormEvent, useEffect } from 'react'

export default function HomePage() {
  const [history, setHistory] = useState<{ type: 'chatbot' | 'you'; prompt: string; timestamp: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState([]);
  const [prompt, setPrompt] = useState('');

  const isPrompt = (message) =>{
    if (message != "") {
      setPrompt(message)
    }else{
      setPrompt("")
    }
  }

  const sendPrompt = async () => {
    setLoading(true);
    
    let tempHistory = [...history, { prompt: "", type: 'chatbot' as 'chatbot', timestamp: Date.now() }];

    setHistory(tempHistory);
    const tempIndex = tempHistory.length - 1;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama3",
        prompt,
      })
    };
    isPrompt("")
    const response = await fetch('http://localhost:11434/api/generate', requestOptions);
    const reader = response.body?.getReader();
    if (reader) {
      let serverResponse = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setLoading(false);
          break;
        }

        const decodedValue = new TextDecoder('utf-8').decode(value);

        try {
          const { response, done, context } = JSON.parse(decodedValue);

          if (response) {
            serverResponse += response;
            tempHistory[tempIndex].prompt = serverResponse;
            setHistory([...tempHistory]);
          }

          if (done) {
            setContext(context);
            console.log(history);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  };
  useEffect(() => {
    if (history.length > 0 && history[history.length - 1].type === 'you') {
      sendPrompt();
    }
  }, [history, sendPrompt]);
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#161617] to-[#2c2a2f] text-white">
      <div className="flex flex-col h-screen">
        <div className="flex-1 overflow-hidden">
          <div className="relative h-full">
            <div className="overflow-y-auto h-full">
              <div className="flex justify-center">
              <div className="w-[80%] pt-8">
              {history.map((item, index) => (
                <div className="mb-6" key={index}>
                  <h1 className="text-xl font-bold mb-2">{`${item.type}`}</h1>
                  <p className="bg-sky-400 w-auto inline-block rounded-lg py-2 px-4">{item.prompt}</p>
                </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center pb-6 ">
          {/* <form action=""> */}
            <input type="text" placeholder="Ketik pesan" className="bg-transparent outline-none border w-[600px] py-4 px-4 rounded-xl border-white" onChange={(e) => isPrompt(e.target.value)} value={prompt}/>
            <button           
              disabled={loading}
              onClick={async () => {
                setHistory(prevHistory => [...prevHistory, { prompt, type: 'you', timestamp: Date.now() }])
              }} 
              className="bg-sky-400 rounded px-4 py-2 ml-4">send</button>
          {/* </form> */}
        </div>
      </div>
    </main>
  );
}
