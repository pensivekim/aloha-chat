import { useState, useRef, useEffect } from "react";
import { Send, Bot, MessageCircle, Loader2, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function ChatPage({ t }) {
  const { facilityProfile, logout } = useAuth();
  const facilityType = facilityProfile?.facilityType || "child";
  const facilityName = facilityProfile?.facilityName || "";

  const [messages, setMessages] = useState([
    { role: "bot", text: t.welcome },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, facilityType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error");
      }

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: `⚠️ ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl flex flex-col overflow-hidden border border-orange-100">
        <header className="bg-gradient-to-r from-orange-300 to-rose-300 px-5 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white tracking-wide">
              {facilityName || t.title}
            </h1>
            <p className="text-xs text-white/80">{t.subtitle}</p>
          </div>
          <button
            onClick={logout}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            title={t.logout}
          >
            <LogOut className="w-4 h-4 text-white" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[420px] max-h-[420px] scroll-smooth">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center mr-2 shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-orange-600" />
                </div>
              )}
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-orange-400 text-white rounded-br-sm"
                    : "bg-amber-50 text-gray-700 rounded-bl-sm border border-amber-100"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center mr-2 shrink-0 mt-1">
                <Bot className="w-4 h-4 text-orange-600" />
              </div>
              <div className="bg-amber-50 text-gray-500 border border-amber-100 rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.thinking}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="border-t border-orange-100 bg-white/60 p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            placeholder={t.placeholder}
            className="flex-1 rounded-full border border-orange-200 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-orange-400 hover:bg-orange-500 active:scale-95 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
