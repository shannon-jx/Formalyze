const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

router.post('/generate-questions', async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
            role: "user",
            content: `Generate 5-10 questions for a survey form in JSON format: {"questions":[{"id": 0, "type": ENUM("radio", "checkbox", "slider", "open-ended"), "question": "", "options": [{"key": 0, "value": ""}]}]}. Purpose of the form: ${message}.`,
            },
        ],
        model: "llama3-8b-8192", 
        temperature: 1,
        max_tokens: 8192,
        top_p: 1,
        stream: false,
        response_format: {
            type: "json_object"
        },
        stop: null
    });

    const responseMessage =
      chatCompletion.choices[0]?.message?.content || 'No response';

    const firstBraceIndex = responseMessage.indexOf('{');
    const lastBraceIndex = responseMessage.lastIndexOf('}');
    const jsonString = responseMessage.substring(firstBraceIndex, lastBraceIndex + 1);
    const jsonParsed = JSON.parse(jsonString);
    console.log(jsonParsed)
    res.json({ message: jsonParsed });
  } catch (error) {
    console.error('Error generating chat:', error);
    res.status(500).json({ error: 'Error generating chat' });
  }
});

module.exports = router;