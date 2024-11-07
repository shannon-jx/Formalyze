import React, { useState } from 'react';
import axios from 'axios';
import './CreateForm.css';
import QuestionsList from './QuestionsList'; 

const CreateForm = () => {
  const [message, setMessage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Create Form');
  const [isEditing, setIsEditing] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);

    try {
      const res = await axios.post('/api/generate-questions', 
        { message },
        {
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          }
        }
      );
      console.log(res);
      setQuestions(res.data.message.questions || []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }

    try {
      const res = await axios.post('/api/generate-questions-title', 
        { message },
        {
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          }
        }
      );
      console.log(res);
      setTitle(res.data.title);
    } catch (err) {
      console.error(err);
      setTitle('');
    }

  };

  return (
    <div className="generate-chat-container">
      <div className="title-container">
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            className="title-input"
            autoFocus
          />
        ) : (
          <h2 className="title">{title}</h2>
        )}
        <button onClick={() => setIsEditing(!isEditing)} className="edit-button">
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
      <p className="subtitle">Generate questions for your survey with AI-powered assistance</p>

      <form onSubmit={handleSubmit} className="chat-form">
        <textarea
          placeholder="Enter the purpose of your form"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="1"
          className="input-textarea"
        />
        <button type="submit" className="generate-button">
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>

      {questions.length > 0 && (
        <QuestionsList
          questions={questions}
          setQuestions={setQuestions}
          title={title}
        />
      )}
    </div>
  );
};

export default CreateForm;