// backend/routes/chatbot.js

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

router.post("/", async (req, res) => {
  try {
    const { message, user } = req.body;
const systemPrompt = `
You are AyurNutri AI Assistant.

Detect the user's language automatically (Hindi, English, Marathi, Gujarati, Tamil, etc.)
Always reply in the SAME language that the user uses.
If the user mixes languages, you can also mix but keep it clear and natural.

You specialize in:
- Ayurvedic health and wellness guidance
- Dosha balancing insights
- Diet and lifestyle recommendations

User info:
- Name: ${user?.name || "Guest"}
- Dosha type: ${user?.dosha || "Unknown"}

Rules:
- Provide only safe wellness & lifestyle guidance.
- DO NOT give strict medical diagnosis or emergency advice.
- Keep answers short, friendly, and easy to understand.
`;



    // Gemini requires messages as one combined prompt
    const fullPrompt = `
${systemPrompt}

User: ${message}
AI:
`;

    const result = await model.generateContent(fullPrompt);

    const reply =
      result?.response?.text() ||
      "I'm sorry, I couldn't generate a response right now.";

    res.json({ reply });
  } catch (err) {
    console.error("Chatbot Error (Gemini):", err);
    res.status(500).json({ error: "Chatbot error" });
  }
});

export default router;
