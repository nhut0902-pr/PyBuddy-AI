// netlify/functions/generate.js (Phiên bản đơn giản hóa)

// Sử dụng cú pháp import thay vì require
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function handler(event, context) {
  const { GEMINI_API_KEY } = process.env;

  if (!GEMINI_API_KEY) {
      return {
          statusCode: 500,
          body: JSON.stringify({ error: "Gemini API key not found." }),
      };
  }

  // Chỉ cho phép phương thức POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return { statusCode: 400, body: JSON.stringify({ error: "Bad Request: Missing prompt" }) };
    }
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: text }),
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
}
