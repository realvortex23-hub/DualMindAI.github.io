// script.js  →  Instant-working version (uses free public proxy)
const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.onclick = sendMessage;
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  addMessage("user", text);
  userInput.value = "";
  addMessage("bot", '<div class="loading"><span></span><span></span><span></span></div>');

  try {
    const response = await fetch("https://gemini-proxy.vercel.app/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();

    chatMessages.lastElementChild.remove();
    addMessage("bot", data.reply
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>'));
  } catch (err) {
    chatMessages.lastElementChild.remove();
    addMessage("bot", `Error: ${err.message}`);
  }
}

function addMessage(sender, html) {
  const div = document.createElement("div");
  div.className = `message ${sender}-message`;
  div.innerHTML = html;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Welcome message
addMessage("bot", "Hey! I'm a Gemini-1.5-Flash powered chatbot. Ask me anything!");
