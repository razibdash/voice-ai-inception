import { searchRAG } from "../services/rag.service";

export const retrieverAgent = async (state: any) => {
  try {
    const context = await searchRAG(state.query);

    return {
      ...state,
      context: context || "",
      next: "grader",
    };
  } catch (error) {
    console.error("Retriever Agent Error:", error);
    return {
      ...state,
      context: "",
      next: "grader",
    };
  }
};