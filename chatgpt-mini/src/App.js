import React, { useState } from "react";

const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setChat([...chat, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: input }),
      });

      const data = await response.json();
      const botReply = data?.[0]?.generated_text || "Maaf, saya tidak bisa menjawab.";
      setChat([...chat, userMessage, { sender: "bot", text: botReply }]);
    } catch (err) {
      setChat([...chat, userMessage, { sender: "bot", text: "Terjadi kesalahan saat menghubungi AI." }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" }}>
      <h2>ChatGPT Mini (Gratis)</h2>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", height: "400px", overflowY: "auto" }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "8px 0" }}>
            <b>{msg.sender === "user" ? "Kamu" : "AI"}:</b> {msg.text}
          </div>
        ))}
        {loading && <div><i>AI sedang mengetik...</i></div>}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Tulis pertanyaanmu..."
        style={{ width: "80%", padding: "10px", marginTop: "16px" }}
      />
      <button onClick={sendMessage} style={{ padding: "10px", marginLeft: "8px" }}>Kirim</button>
    </div>
  );
}

export default App;