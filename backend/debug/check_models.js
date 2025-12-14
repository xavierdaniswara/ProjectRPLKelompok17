// check_models.js
require('dotenv').config(); 
// Or if your .env is in a parent folder, use: require('dotenv').config({ path: './.env' });

console.log("DEBUG: API Key is:", process.env.GEMINI_API_KEY ? "LOADED" : "UNDEFINED");
// Do NOT log the actual key to the console for safety, just check if it exists.

require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Checking API access...");
    
    // There isn't a direct "listModels" helper in the high-level client 
    // effectively exposed for simple debugging, so we try a basic prompt:
    const result = await model.generateContent("Hello");
    console.log("Success! Model works:", result.response.text());
    
  } catch (error) {
    console.error("Error details:", error.message);
    if (error.response) {
        console.error("Full Error:", JSON.stringify(error.response, null, 2));
    }
  }
}

listModels();