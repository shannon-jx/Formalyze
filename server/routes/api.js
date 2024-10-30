const express = require('express');
const router = express.Router();

router.post('/poking-questions', async (req, res) => {
  try {
    const { question, answer } = req.body;
    // Use your AI model or logic here to generate a follow-up question
    // based on both the original question and the user's answer
    const followUpQuestion = await generateFollowUpQuestion(question, answer);
    res.json({ message: followUpQuestion });
  } catch (error) {
    console.error('Error generating follow-up question:', error);
    res.status(500).json({ error: 'Failed to generate follow-up question' });
  }
});

// You'll need to implement this function based on your AI model or logic
async function generateFollowUpQuestion(question, answer) {
  // This is a placeholder. Replace with your actual implementation.
  return `Based on your answer to "${question}", can you elaborate further?`;
}

module.exports = router;
