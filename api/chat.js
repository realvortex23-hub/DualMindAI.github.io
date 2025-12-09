// api/chat.js  (Vercel serverless function – NEVER in your GitHub Pages repo)
import { GoogleGenerativeAI } from "@google/generative-ai";

// Your API key is injected securely by Vercel (never hardcoded!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  // CORS – allow your GitHub Pages site
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",        // ← fast & free tier
      // model: "gemini-1.5-pro",       // ← uncomment for smarter responses
    });

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ 
      error: "Gemini API failed", 
      details: error.message 
    });
  }
}
