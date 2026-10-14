import express from "express";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not set — the chatbot endpoint will fail.");
}

const router = express.Router();

/* =====================
   GROQ CLIENT
   (was reading GROQ_API_KEY2, a copy-paste typo that silently broke this
   feature unless a second, unused env var happened to be set)
===================== */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =====================
   CHATBOT ENDPOINT
===================== */
router.post("/", async (req, res) => {
  try {
    const { message, user } = req.body || {};

    if (!message) {
      return res.status(400).json({
        reply: "Please enter a message.",
      });
    }

    const systemPrompt = `
You are AyurNutri AI Assistant.

LANGUAGE:
- Reply in the SAME language as the user.
- Keep responses short and natural.

STYLE:
- No markdown, no emojis, no lists.

USER INFO:
Name: ${user?.name || "Guest"}
Dosha: ${user?.dosha || "Unknown"}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",

      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.6,
      max_tokens: 300,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I could not respond right now.";

    res.json({ reply });
  } catch (error) {
    console.error("Groq chatbot error:", error);
    res.status(500).json({
      reply: "I’m having trouble responding right now. Please try again.",
    });
  }
});

export default router;
