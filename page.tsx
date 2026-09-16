"use client";

import { useState } from "react";
import Image from "next/image";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "مرحباً بكِ في ATC Group. أنا مساعد Agile الذكي، كيف يمكنني مساعدتك اليوم في قطاعاتنا المختلفة (الهندسة، الطاقة، الذكاء الاصطناعي، الزراعة...)؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // قائمة الأسئلة السريعة المقترحة
  const quickSuggestions = [
    "قطاع الطاقة المتجددة (Agile Energy)",
    "التصنيع الغذائي (Agile Factory)",
    "خدمات الذكاء الاصطناعي",
    "كيف أتواصل معكم؟"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage = textToSend;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "عذراً، حدث خطأ في الاتصال." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      {/* Header with ATC Branding & Logo */}
      <header className="bg-[#002D62] text-white p-4 flex justify-between items-center shadow-md border-b-4 border-[#ED1C24]">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div>
            <h1 className="text-xl font-bold">ATC Agile Assistant</h1>
            <p className="text-xs text-blue-200">Agile Transformation Company</p>
          </div>
        </div>
        <div className="bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ATC Logo"
            width={120}
            height={45}
            className="h-10 w-auto object-contain"
            priority
          />
        </div>
      </header>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-4xl w-full mx-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xl rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-[#002D62] text-white rounded-bl-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-br-none whitespace-pre-line"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-500 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm text-sm animate-pulse">
              جاري الكتابة...
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestion Chips */}
      <div className="max-w-4xl w-full mx-auto px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {quickSuggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(suggestion)}
            disabled={loading}
            className="bg-white hover:bg-blue-50 text-[#002D62] border border-blue-200 text-xs px-3 py-1.5 rounded-full shadow-sm transition whitespace-nowrap disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-[#002D62] text-sm shadow-inner"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ED1C24] hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition duration-200 shadow-md disabled:opacity-50"
          >
            إرسال
          </button>
        </form>
      </div>
    </main>
  );
}