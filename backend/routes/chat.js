const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const ChatMessage = require('../models/ChatMessage');

// --- NEW IMPORTS FOR AGENTIC WORKFLOW ---
const chatModel = require('../agents/medicalAgents');// The configured Gemini Model
const { toolFunctions } = require('../tools');       // The executable tool logic

router.post('/', requireLogin, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    // 1. Get User ID (Using session as per your code)
    const userId = req.session.user.id;

    // 2. Save the User's Message to DB
    await ChatMessage.create({ user: userId, role: 'user', content: message });

    // 3. Fetch History & Format for Gemini
    // Gemini uses 'model' instead of 'assistant', and a different structure
    const historyDocs = await ChatMessage.find({ user: userId })
      .sort({ createdAt: -1 }) // Get newest first to limit correctly
      .limit(10); // Limit context to save tokens

    const history = historyDocs.reverse().map(doc => ({
      role: doc.role === 'assistant' ? 'model' : 'user', // Map DB role to Gemini role
      parts: [{ text: doc.content }]
    }));

    // --- FIX: SANITIZE HISTORY ---
    // Gemini Rule: The first message in history MUST be from the 'user'.
    // If the slice starts with 'model', remove it.
    if (history.length > 0 && history[0].role === 'model') {
      history.shift(); // Removes the first element
    }

    // 4. Start the Chat Session with History
    const chat = chatModel.startChat({
      history: history,
    });

    // 5. Send User Message to Gemini
    let result = await chat.sendMessage(message);

    // --- THE AGENTIC LOOP ---
    // This loop runs as long as Gemini wants to use tools (e.g., check calendar, then book)
    try {
      while (result.response.functionCalls()) {
        const calls = result.response.functionCalls();
        const toolResponses = [];

        for (const call of calls) {
          const functionName = call.name;
          const functionArgs = call.args;

          console.log(`🤖 Agent is executing tool: ${functionName}`);

          // Execute the actual Javascript function from tools/index.js
          if (toolFunctions[functionName]) {
            const functionResponse = await toolFunctions[functionName](functionArgs);
            
            // Prepare the result to send back to Gemini
            toolResponses.push({
              functionResponse: {
                name: functionName,
                response: { content: functionResponse } // Must be an object
              }
            });
          } else {
             console.error(`Tool ${functionName} not found`);
          }
        }

        // Send the tool results back to Gemini so it can continue thinking
        result = await chat.sendMessage(toolResponses);
      }
    } catch (loopError) {
      console.error("Error during tool execution loop:", loopError);
      return res.status(500).json({ message: "Error processing agent tools." });
    }

    // 6. Get Final Text Response
    const botReply = result.response.text();

    // 7. Save AI Response to DB
    // We save as 'assistant' to keep your DB consistent with OpenAI format
    await ChatMessage.create({ user: userId, role: 'assistant', content: botReply });

    res.json({ reply: botReply });

  } catch (err) {
    console.error("Chat Route Error:", err);
    res.status(500).json({ message: 'Error processing chat' });
  }
});

// GET History (Kept mostly the same, just ensured sort order)
router.get('/history', requireLogin, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const history = await ChatMessage.find({ user: userId }).sort({ createdAt: 1 }).limit(50);
    res.json({ history });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching history' });
  }
});

module.exports = router;