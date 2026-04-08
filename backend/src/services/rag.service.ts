import { initVectorStore } from "./vector.service";

export const searchRAG = async (query: string) => {
  try {
    const store = await initVectorStore();

    if (!store) {
      console.warn("Vector store is not initialized");
      return null;
    }

    const results = await store.similaritySearch(query, 2);

    if (!results || results.length === 0) {
      console.warn("No RAG results found for query:", query);
      return null;
    }

    const combined = results
      .map((r: { pageContent: string }) => r.pageContent)
      .filter((content: string) => content && content.trim().length > 0)
      .join("\n");

    return combined.length > 0 ? combined : null;
  } catch (error) {
    console.error("RAG Service Error:", error);
    return null;
  }
};