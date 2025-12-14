require('dotenv').config();

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("❌ Error: GEMINI_API_KEY is missing from .env");
    return;
  }

  // Remove potential accidental whitespace
  const cleanKey = apiKey.trim();
  
  console.log(`🔑 Testing Key: ${cleanKey.substring(0, 8)}... (Hidden)`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error("\n❌ API REQUEST FAILED");
      console.error(`Status: ${response.status} ${response.statusText}`);
      console.error("Error Message:", JSON.stringify(data, null, 2));
    } else {
      console.log("\n✅ SUCCESS! Connection established.");
      console.log("Available Models:");
      // Filter for 'gemini' models and print their names
      const geminiModels = data.models
        .filter(m => m.name.includes('gemini'))
        .map(m => m.name.replace('models/', ''));
      
      console.log(geminiModels.join('\n'));
    }
  } catch (error) {
    console.error("Network Error:", error);
  }
}

listModels();