const API_KEY_STORAGE = "gemini_api_key";
let API_KEY = localStorage.getItem(API_KEY_STORAGE);

const chatMessages = document.getElementById("chat-messages");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const modal = document.getElementById("api-key-modal");
const apiKeyInput = document.getElementById("api-key-input");
const saveKeyBtn = document.getElementById("save-key");

// Show modal if no API key
if (!API_KEY) {
  modal.style.display = "flex";
}

saveKeyBtn.onclick = () => {
  API_KEY = apiKeyInput.value.trim();
  if (API_KEY) {
    localStorage.setItem(API_KEY_STORAGE, API_KEY);
    modal.style.display = "none";
    addMessage("bot", "👋 Hi! I'm powered by Google's Gemini. How can I help you today?");
  } else {
    alert("Please enter a valid API key");
  }
};

// Allow Enter to send, Shift+Enter for new line
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

sendBtn.onclick = sendMessage;

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || !API_KEY) return;

  addMessage("user", text);
  userInput.value = "";
  addMessage("bot", '<div class="loading"><span></span><span></span><span></span></div>');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text }] }]
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${err}`);
    }

    const data = await response.json();
    const botReply = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
      .replace(/\n/g, '<br>');

    // Remove loading and add real reply
    chatMessages.lastElementChild.remove();
    addMessage("bot", botReply || "No response from Gemini 😔");

  } catch (err) {
    chatMessages.lastElementChild.remove();
    addMessage("bot", `⚠️ Error: ${err.message}`);
    console.error(err);
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}-message`;
  div.innerHTML = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Optional: Clear API key
// localStorage.removeItem(API_KEY_STORAGE);
