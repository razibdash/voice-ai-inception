import axios from "axios";

export const webSearch = async (query: string): Promise<string> => {
  try {
    if (!query || query.trim().length === 0) {
      return "Please provide a valid search query";
    }

    const encodedQuery = encodeURIComponent(query.trim());
    
    const res = await axios.get(
      `https://api.duckduckgo.com/?q=${encodedQuery}&format=json`,
      {
        timeout: 10000, // 10 second timeout
      }
    );

    // Try to extract relevant information
    const result = res.data.Abstract || res.data.Heading || res.data.Answer;

    if (result && result.length > 0) {
      return result;
    }

    console.warn("Web search returned no useful results for query:", query);
    return "No web results found for your query";
  } catch (err) {
    console.error("Web Search Error:", err);
    return "Unable to fetch web results at this time";
  }
};