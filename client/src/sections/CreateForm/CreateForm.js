import React, { useState } from 'react';
import axios from 'axios';
import './CreateForm.css';
import QuestionsList from './QuestionsList';  // Importing the new component

const CreateForm = () => {
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);

    try {
      const res = await axios.post('/api/generate-questions', { message });
      console.log(res);
      setQuestions(res.data.message.questions || []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-chat-container">
      <h1 className="title">Create Form</h1>
      <p className="subtitle">Generate questions for your survey with AI-powered assistance</p>

      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          placeholder="Enter the purpose of your form"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="1"
          className="input-textarea"
        />
        <button type="submit" className="submit-button">
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {questions.length > 0 && (
        <QuestionsList
          questions={questions}
          setQuestions={setQuestions}
        />
      )}
    </div>
  );
};

export default CreateForm;