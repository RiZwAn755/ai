import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(prompt, modelName = "gemini-1.5-flash") {
  try {
    const model = ai.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    // Log the error for debugging
    console.error("[Gemini API Error]:", error);
    // Return a user-friendly error message
    return `[Gemini API Error]: ${error.message || "Unknown error occurred."}`;
  }
}

export default main;