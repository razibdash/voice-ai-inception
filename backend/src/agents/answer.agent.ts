import { groqClient } from "../config/groq";
import { buildPrompt } from "../utils/prompt";

export const answerAgent = async (state: any) => {
  try {
    const prompt = buildPrompt(state.context, state.query);

    const res = await groqClient.post("/chat/completions", {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a professional AI assistant." },
        { role: "user", content: prompt },
      ],
    });

    // Validate API response structure
    if (!res.data || !res.data.choices || res.data.choices.length === 0) {
      throw new Error("Invalid API response: no choices returned");
    }

    const answer = res.data.choices[0]?.message?.content;
    
    if (!answer) {
      throw new Error("Failed to extract answer from API response");
    }

    return {
      ...state,
      answer: answer.trim(),
      next: "end",
    };
  } catch (error) {
    console.error("Answer Agent Error:", error);
    return {
      ...state,
      answer: "Sorry, I couldn't generate an answer at this time.",
      next: "end",
    };
  }
};