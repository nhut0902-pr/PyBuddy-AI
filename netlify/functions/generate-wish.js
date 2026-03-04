
export async function handler(event, context) {
  const { INCEPTION_API_KEY } = process.env;

  if (!INCEPTION_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Inception API key not found." }),
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, details } = JSON.parse(event.body);

    if (!name) {
      return { statusCode: 400, body: JSON.stringify({ error: "Bad Request: Missing name" }) };
    }

    const prompt = `Viết một lời chúc mừng sinh nhật thật hay, cảm động và sáng tạo dành cho ${name}. ${details ? `Thông tin thêm: ${details}` : ''} Lời chúc nên bằng tiếng Việt, ấm áp và chân thành. Giới hạn trong khoảng 3-4 câu.`;

    const response = await fetch('https://api.inceptionlabs.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INCEPTION_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mercury-2',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Inception API Error:", errorData);
      throw new Error('Failed to generate wish from Inception API.');
    }

    const data = await response.json();
    const wish = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ wish }),
    };
  } catch (error) {
    console.error("Error calling Inception API:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal Server Error" }) };
  }
}
