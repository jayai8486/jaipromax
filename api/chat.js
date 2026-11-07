module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Please enter a message." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key is not configured." });
  }

  if (message.length > 4000) {
    return res.status(400).json({ error: "Message is too long." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": (Bearer) ${process.env.OPENAI_API_KEY}'
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: "You are JAI, a helpful personal AI assistant. Give clear and useful answers.",
        input: message,
        max_output_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({ error: "AI service request failed." });
    }

    return res.status(200).json({
      reply: data.output_text || "No response received."
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error. Please try again."
    });
  }
};
