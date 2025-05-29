
import React, { useState } from "react";

const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

const modes = {
  chat: "Chat Umum",
  curhat: "Curhat Rahasia",
  edukasi: "Tanya Edukasi"
};

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("chat");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const promptMap = {
      chat: input,
      curhat: `Saya ingin curhat. Tolong dengarkan dan beri tanggapan dengan empati: ${input}`,
      edukasi: `Saya ingin belajar. Tolong jelaskan secara edukatif: ${input}`
    };

    const userMessage = { sender: "user", text: input, type: mode };
    setChat([...chat, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer hf_XXXXXXXXXXXXXXXXXXXXXXXX`,  // Ganti dengan token kamu
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: promptMap[mode] }),
      });

      const data = await response.json();
      const botReply = data?.[0]?.generated_text?.slice(promptMap[mode].length).trim() || "Maaf, saya tidak bisa menjawab.";
      setChat([...chat, userMessage, { sender: "bot", text: botReply, type: mode }]);
    } catch (err) {
      setChat([...chat, userMessage, { sender: "bot", text: "Terjadi kesalahan saat menghubungi AI.", type: mode }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 font-sans">
      <div className="max-w-2xl mx-auto bg-gray-850 rounded-2xl shadow-2xl p-6 border border-gray-700">
        <h2 className="text-3xl font-semibold text-center mb-4">💬 ChatGPT Mini</h2>

        <div className="flex justify-center gap-2 mb-4">
          {Object.entries(modes).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                mode === key ? "bg-purple-600 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="h-96 overflow-y-auto space-y-4 p-4 rounded-lg bg-gray-800 border border-gray-700">
          {chat.map((msg, index) => (
            <div
              key={index}
              className={`relative text-sm px-4 py-3 rounded-2xl max-w-[80%] shadow-md ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-600 text-white text-right"
                  : "mr-auto bg-gray-700 text-white text-left"
              }`}
            >
              <div className="text-xs font-bold mb-1 text-gray-300">{msg.sender === "user" ? "Kamu" : "AI"}</div>
              <div>{msg.text}</div>
              <div className="text-[10px] italic mt-1 text-gray-400">({modes[msg.type]})</div>
            </div>
          ))}
          {loading && <div className="text-center text-sm italic text-gray-400">AI sedang mengetik...</div>}
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Tulis pesan kamu..."
            className="flex-1 px-4 py-2 rounded-l-lg border-t border-l border-b border-gray-600 bg-gray-700 text-white placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-lg"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
