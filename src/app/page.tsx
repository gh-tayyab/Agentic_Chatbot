"use client";
import { useState } from "react";
import axios from "axios";

type Message = {
  text: string;
  sender: "user" | "bot";
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(""); // State for response
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const backendUrl = "https://938f-34-82-120-136.ngrok-free.app/chat";

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setMessages([...messages, { text: message, sender: "user" }]);

    try {
      const res = await axios.post(
        backendUrl,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessages([
        ...messages,
        { text: message, sender: "user" },
        { text: res.data.response, sender: "bot" },
      ]);
      setResponse(res.data.response); // Set the response
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages([
        ...messages,
        { text: message, sender: "user" },
        { text: "There was an error sending your message.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-50">
      <header className="w-full sticky top-0 bg-gray-50 py-4 shadow">
        <div className="container mx-auto text-center">
          <h1 className="text-black text-2xl font-bold">AI Chatbot</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto flex flex-col items-center">
        <div className="w-full mt-2 space-x-2 gap-x-4 bg-gray-50 flex-1">
          <div className="flex flex-col space-y-4 px-4">
            <div className="h-80 overflow-y-auto bg-gray-50 border border-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-3 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-lg shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gray-50 text-gray-800"
                        : "bg-gray-50 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <textarea
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-100 resize-none"
              rows={2}
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </main>

      <footer className="w-full bg-gray-50 py-4 mt-4 text-center text-black">
        <p>Agentia World</p>
      </footer>
    </div>
  );
}
