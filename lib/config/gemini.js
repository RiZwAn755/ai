import { GoogleGenerativeAI } from "@google/generative-ai";

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main(prompt, modelName = "gemini-1.5-flash") {
  try {
    const model = ai.getGenerativeModel({ model: modelName });
    
    // Enhanced prompt that includes formatting instructions
    const enhancedPrompt = `You are a professional blog writer. Always respond with properly formatted HTML content that includes:
    - <h2> tags for section headings
    - <p> tags for paragraphs
    - <ul> and <li> tags for bullet points
    - Proper spacing and structure
    - Engaging, informative content
    - Professional yet conversational tone

    Now, please write a blog post about: ${prompt}`;
    
    const result = await model.generateContent(enhancedPrompt);
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