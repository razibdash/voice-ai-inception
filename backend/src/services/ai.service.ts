import { groqClient } from "../config/groq";
import { searchRAG } from "./rag.service";
import { webSearch } from "./agent.service";
import { buildPrompt } from "../utils/prompt";

export const generateAIResponse = async (query: string) => {
  let context = await searchRAG(query);

  let source = "RAG";

  // If RAG result is weak → fallback to web
  if (!context || context.length < 20) {
    context = await webSearch(query);
    source = "WEB";
  }

  const prompt = buildPrompt(context, query);

  const res = await groqClient.post("/chat/completions", {
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content: "You are a professional AI assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return {
    answer: res.data.choices[0].message.content,
    source,
  };
};