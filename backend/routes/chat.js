const express = require('express');
const requireLogin = require('../middleware/requireLogin');
const ChatMessage = require('../models/ChatMessage');
const { chatWithOpenAI } = require('../utils/openaiClient');

const router = express.Router();

const SYSTEM_PROMPT = `
You are a helpful medical assistant chatbot.
Provide general health advice only, not a diagnosis.
Always include a disclaimer: "Informasi ini bersifat umum, bukan pengganti konsultasi dokter."
Encourage users to see a healthcare professional if symptoms persist.
`;

router.post('/', requireLogin, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const userId = req.session.user.id;
    await ChatMessage.create({ user: userId, role: 'user', content: message });

    const history = await ChatMessage.find({ user: userId }).sort({ createdAt: 1 }).limit(10);
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    history.forEach(m => messages.push({ role: m.role, content: m.content }));
    messages.push({ role: 'user', content: message });

    const reply = await chatWithOpenAI(process.env.OPENAI_MODEL, messages);
    await ChatMessage.create({ user: userId, role: 'assistant', content: reply });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing chat' });
  }
});

router.get('/history', requireLogin, async (req, res) => {
  const userId = req.session.user.id;
  const history = await ChatMessage.find({ user: userId }).sort({ createdAt: 1 }).limit(50);
  res.json({ history });
});

module.exports = router;