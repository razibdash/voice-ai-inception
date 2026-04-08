import { routerAgent } from "../agents/router.agent";
import { retrieverAgent } from "../agents/retriever.agent";
import { graderAgent } from "../agents/grader.agent";
import { webAgent } from "../agents/web.agent";
import { answerAgent } from "../agents/answer.agent";

export const runGraph = async (query: string) => {
  try {
    let state: any = {
      query: query.trim(),
      context: "",
      source: "RAG",
      answer: "",
      next: "router",
    };

    let iterations = 0;
    const maxIterations = 10; // Prevent infinite loops

    while (state.next !== "end" && iterations < maxIterations) {
      iterations++;
      
      console.log(`[Graph] Iteration ${iterations}: ${state.next}`);

      switch (state.next) {
        case "router":
          state = await routerAgent(state);
          break;

        case "retriever":
          state = await retrieverAgent(state);
          break;

        case "grader":
          state = await graderAgent(state);
          break;

        case "web":
          state = await webAgent(state);
          break;

        case "answer":
          state = await answerAgent(state);
          break;

        default:
          console.warn(`[Graph] Unknown state: ${state.next}`);
          state.next = "end";
      }
    }

    if (iterations >= maxIterations) {
      console.error("[Graph] Max iterations reached, stopping");
      state.answer = "Process timed out. Please try again.";
    }

    // Validate final answer
    if (!state.answer || state.answer.trim().length === 0) {
      state.answer = "Unable to generate a response at this time.";
    }

    return {
      answer: state.answer.trim(),
      source: state.source,
    };
  } catch (error) {
    console.error("[Graph] Pipeline Error:", error);
    return {
      answer: "An error occurred while processing your query.",
      source: "ERROR",
    };
  }
};