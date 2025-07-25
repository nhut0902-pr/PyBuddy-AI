// netlify/functions/generate.js (NỘI DUNG ĐÚNG)
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Lấy API key từ biến môi trường của Netlify, không hardcode vào đây!
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handler = async function (event, context) {
  // Chỉ cho phép phương thức POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return { statusCode: 400, body: "Bad Request: Missing prompt" };
    }

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
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
