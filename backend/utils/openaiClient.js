const axios = require('axios');

async function chatWithOpenAI(model, messages) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    { model, messages, temperature: 0.3, max_tokens: 700 },
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
  );

  return response.data.choices[0].message.content;
}

module.exports = { chatWithOpenAI };