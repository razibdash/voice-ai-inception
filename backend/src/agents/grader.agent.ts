export const graderAgent = async (state: any) => {
  try {
    const isGood = state.context && state.context.length > 30;

    if (!isGood) {
      console.log("[Grader] Context quality is low, will try web search");
    }

    return {
      ...state,
      next: isGood ? "answer" : "web",
    };
  } catch (error) {
    console.error("Grader Agent Error:", error);
    // Default to web search on error
    return {
      ...state,
      next: "web",
    };
  }
};