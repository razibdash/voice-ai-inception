import axios from "axios";

// Validate API key exists
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY environment variable is not set");
}

export const groqClient = axios.create({
  baseURL: "https://api.groq.com/openai/v1",
  headers: {
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 second timeout
});

// Add error interceptor for better debugging
groqClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Groq API Error:", {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
    });
    return Promise.reject(error);
  }
);