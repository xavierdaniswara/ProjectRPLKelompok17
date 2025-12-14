// tools/webSearch.js
const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

/**
 * Searches the web using Google Custom Search API.
 * @param {string} query - The search query.
 * @returns {Promise<string>} - Formatted search results.
 */
async function searchWeb(query) {
  try {
    const params = new URLSearchParams({
      key: process.env.GOOGLE_SEARCH_API_KEY,
      cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
      q: query,
      num: 5 // Limit to 5 results to save context window space
    });

    const response = await fetch(`${GOOGLE_SEARCH_URL}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Google Search API Error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return "No results found for this query.";
    }

    // Map results to a string format easy for the AI to read
    const results = data.items.map(item => 
      `Title: ${item.title}\nLink: ${item.link}\nSnippet: ${item.snippet}\n`
    ).join('\n---\n');

    return results;

  } catch (error) {
    console.error("Web Search Tool Error:", error);
    return "Error occurred while searching the web.";
  }
}

module.exports = { searchWeb };