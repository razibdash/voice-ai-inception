import { webSearch } from "../services/agent.service";

export const webAgent = async (state: any) => {
  try {
    const webData = await webSearch(state.query);

    return {
      ...state,
      context: webData || "No information found",
      source: "WEB",
      next: "answer",
    };
  } catch (error) {
    console.error("Web Agent Error:", error);
    return {
      ...state,
      context: "Unable to fetch web data",
      source: "WEB",
      next: "answer",
    };
  }
};