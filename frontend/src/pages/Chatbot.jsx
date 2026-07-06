import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setError("");
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    const promptInput = input;
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat`,
        {
          message: promptInput,
          history: messages,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      setError("AI service failed to respond. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto min-h-screen flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Agricultural Assistant
          </h1>
          <p className="text-slate-400 text-xs mt-1">Ask questions regarding crop choices, fertilizer techniques, pest prevention, or soil analysis.</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden min-h-[450px] shadow-lg">
        {/* Messages list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[480px]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center py-12">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <p className="font-semibold text-slate-300 text-sm mb-1">Welcome to AgriShield AI Assistant</p>
              <p className="text-xs text-slate-500 max-w-xs">Ask anything regarding watering schedules, NPK, leaf spots, and soil compositions.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-md rounded-xl p-4 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-brand-600 text-white rounded-br-none"
                      : "bg-slate-950 border border-slate-850 text-slate-300 rounded-bl-none"
                  }`}
                >
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {m.role === "user" ? "User" : "AgriShield Assistant"}
                  </span>
                  <p className="whitespace-pre-line">{m.content}</p>
                </div>
              </motion.div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 border border-slate-850 text-slate-300 rounded-xl rounded-bl-none p-4 w-40">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">AgriShield Assistant</span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          {error && <div className="p-3 bg-rose-950/30 border border-rose-900/50 text-rose-400 text-xs rounded-lg text-center">{error}</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-800 bg-slate-950/50 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-slate-950 border border-slate-850 focus:border-brand-500 rounded-lg px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
            placeholder="Ask about crops, fertilizers, pests..."
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/30 text-white font-semibold rounded-lg transition flex items-center justify-center text-xs"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
