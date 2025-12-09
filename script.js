// script.js  (Frontend – completely safe, no API key here!)

const PROXY_URL = "dualmindai-lp6i7fvq5-real-ares-projects.vercel.app/api/chat";  // ← CHANGE THIS!

const chatDiv = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
let history = [];  // Keeps conversation context

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = text;
  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.id = "typingIndicator";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatDiv.appendChild(typing);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function hideTyping() {
  const indicator = document.getElementById("typingIndicator");
  if (indicator) indicator.remove();
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";
  sendButton.disabled = true;
  showTyping();

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });

    const data = await response.json();
    hideTyping();

    if (data.reply) {
      addMessage("bot", data.reply);
      history.push({ role: "user", parts: [{ text: message }] });
      history.push({ role: "model", parts: [{ text: data.reply }] });
    } else {
      addMessage("bot", "Sorry, something went wrong: " + (data.error || "Unknown"));
    }
  } catch (err) {
    hideTyping();
    addMessage("bot", "Connection failed – check your proxy URL");
    console.error(err);
  } finally {
    sendButton.disabled = false;
    input.focus();
  }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Focus input on load
window.addEventListener("load", () => input.focus());
