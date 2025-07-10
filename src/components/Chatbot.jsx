import React, { useState, useEffect, useRef } from "react";
import { askAI } from "../api/chatbotService";
import "../styles/Chatbot.css";

const Chatbot = ({ dashboardData }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (chatRef.current) {
      const shouldScroll =
        chatRef.current.scrollHeight - chatRef.current.scrollTop <=
        chatRef.current.clientHeight + 100;
      if (shouldScroll) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // Show initial AI greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text:
            "👋 Hello! I'm Alpha Assistant.\n" +
            "Ask me questions like:\n• What are the top insights?\n• Show the correlation matrix\n• Forecast revenue trends\n• Explain recent anomalies",
          sender: "bot",
        },
      ]);
    }
  }, []);

  const handleSend = async () => {
    const query = userInput.trim();
    if (!query || loading) return;

    if (!Array.isArray(dashboardData) || dashboardData.length === 0) {
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ No dashboard data available to analyze.", sender: "bot" },
      ]);
      return;
    }

    setMessages((prev) => [...prev, { text: query, sender: "user" }]);
    setUserInput("");
    setLoading(true);

    try {
      const response = await askAI(query, dashboardData);
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Chatbot Error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Something went wrong. Try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadChat = () => {
    const content = messages
      .map((msg) => `${msg.sender === "user" ? "You" : "Alpha"}: ${msg.text}`)
      .join("\n\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chat_history.txt";
    a.click();
  };

  const quickPrompts = [
    "Show summary",
    "Explain correlation",
    "What's the trend?",
    "Forecast next quarter",
    "Give me outliers",
  ];

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      {/* Chat Toggle */}
      <div
        className="chat-icon"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        aria-label="Toggle Chat"
      >
        💬
      </div>

      {isOpen && (
        <div className="chat-box">
          {/* Messages */}
          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender}`}
                title="Click to copy"
                onClick={() => navigator.clipboard.writeText(msg.text)}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Smart Suggestions */}
          <div className="chat-suggestions">
            {quickPrompts.map((prompt, i) => (
              <button key={i} onClick={() => setUserInput(prompt)}>
                {prompt}
              </button>
            ))}
          </div>

          {/* Input + Export */}
          <div className="chat-input">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              placeholder="Ask AI about your dashboard..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !userInput.trim()}>
              {loading ? "⏳" : "Send"}
            </button>
          </div>

          <button className="chat-download-btn" onClick={downloadChat}>
            ⬇️ Export Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
