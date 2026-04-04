import axios from "axios";

export const generateAIResponse = async (userQuery: string) => {
  try {
    const systemPrompt = `
You are a professional Voice AI Assistant for Inception BD, a software and AI solutions company.

Rules:
- Be professional and concise
- Answer clearly
- If info is unknown, give a smart general answer
- Be helpful and confident
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return "Sorry, something went wrong.";
  }
};