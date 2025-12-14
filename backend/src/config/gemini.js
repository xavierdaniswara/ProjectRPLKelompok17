const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize the API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the model you want to use (Flash is faster for agents)
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    // This is where you will eventually bind your tools
});

module.exports = model;
