import { ChatGroq } from "@langchain/community/chat_models/groq";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "@langchain/community/tools/serpapi";

export const createAgent = async () => {
  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama3-70b-8192",
  });

  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY!, {
      location: "Bangladesh",
    }),
  ];

  const agent = await initializeAgentExecutorWithOptions(tools, llm, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  return agent;
};