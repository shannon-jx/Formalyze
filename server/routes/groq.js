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

router.post('/analyze-sentiment', async (req, res) => {
  const { responses, formQuestions } = req.body; // Expect both responses and formQuestions to be sent from the frontend

  try {
    const promptContent = `
      Perform sentiment analysis on the following survey responses: ${JSON.stringify(responses)}.
      Here are the form questions: ${JSON.stringify(formQuestions)}.
    `;
    console.log('Prompt Content: ' + promptContent);

    const sentimentAnalysis = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: promptContent, 
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: 'json_object',
      },
      stop: null,
    });

    const responseMessage =
      sentimentAnalysis.choices[0]?.message?.content || 'No sentiment analysis result';

    const firstBraceIndex = responseMessage.indexOf('{');
    const lastBraceIndex = responseMessage.lastIndexOf('}');
    const jsonString = responseMessage.substring(firstBraceIndex, lastBraceIndex + 1);
    const jsonParsed = JSON.parse(jsonString);
    
    res.json({ analysis: jsonParsed });
  } catch (error) {
    console.error('Error performing sentiment analysis:', error);
    res.status(500).json({ error: 'Error performing sentiment analysis' });
  }
});




router.post('/generate-questions-title', async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
            role: "user",
            content: `Generate a title for a survey form, the purpose of the form is ${message}. The title should be a short, concise, and informative title. Respond with only the title. remove any quotes marks.`,
            },
        ],
        model: "llama3-8b-8192", 
        temperature: 1,
        max_tokens: 8192,
        top_p: 1,
        stream: false,
        stop: null
    });
    
    const responseMessage = chatCompletion.choices[0].message.content || 'No Title Generated';
    // console.log(responseMessage)
      res.json({ title: responseMessage });
  } catch (error) {
    console.error('Error generating chat:', error);
    res.status(500).json({ error: 'Error generating chat' });
  }
});


router.post('/poking-questions',async(req,res)=>{
  const { message } = req.body;


  try {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
            role: "user",
            content: `Generate 2 more questions base on the question and answer. The purpose is to find out the reason of choose the answer. 
            The question need to be in JSON format: {"questions":[{"id": 0, "type": ENUM("radio", "checkbox", "slider", "open-ended"), "question": "", "options": [{"key": 0, "value": ""}]}]}. The question is: ${message} and the answer to `,
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