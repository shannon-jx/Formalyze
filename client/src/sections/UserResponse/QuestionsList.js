import React, { useState } from 'react';
// import { db, addDoc, collection } from './firebaseConfig'; // Import Firebase config
import './CreateForm.css';

const QuestionsList = ({ questions, setQuestions }) => {
  const [saving, setSaving] = useState(false);

  const handleQuestionChange = (index, newQuestion) => {
    const updatedQuestions = questions.map((question, i) =>
      i === index ? { ...question, question: newQuestion } : question
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, newValue) => {
    const updatedQuestions = questions.map((question, i) => {
      if (i === questionIndex) {
        const updatedOptions = question.options.map((option, j) =>
          j === optionIndex ? { ...option, value: newValue } : option
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const handleTypeChange = (questionIndex, newType) => {
    const updatedQuestions = questions.map((question, i) =>
      i === questionIndex ? { ...question, type: newType } : question
    );
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = questions.map((question, i) => {
      if (i === questionIndex) {
        const newOption = { value: '' };
        return { ...question, options: [...question.options, newOption] };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const renderInputField = (question, questionIndex) => {
    switch (question.type) {
      case 'radio':
        return (
          <>
            {question.options.map((option, index) => (
              <div key={index} className="option-container">
                <input
                  type="radio"
                  value={option.value}
                  onChange={() => {}}
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(questionIndex, index, e.target.value)}
                  placeholder="Add Option"
                  className="option-input"
                />
              </div>
            ))}
            <button type="button" onClick={() => addOption(questionIndex)}>Add Option</button>
          </>
        );
      case 'checkbox':
        return (
          <>
            {question.options.map((option, index) => (
              <div key={index} className="option-container">
                <input
                  type="checkbox"
                  value={option.value}
                  onChange={() => {}}
                />
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => handleOptionChange(questionIndex, index, e.target.value)}
                  placeholder="Add Option"
                  className="option-input"
                />
              </div>
            ))}
            <button type="button" onClick={() => addOption(questionIndex)}>Add Option</button>
          </>
        );
      case 'slider':
        return (
          <input
            type="range"
            min="0"
            max="10"
          />
        );
      case 'open-ended':
        return <div />;
      default:
        return null;
    }
  };

  const handleCreateForm = async () => {
    // setSaving(true);
    // try {
    //   // Save the form to Firestore
    //   await addDoc(collection(db, 'forms'), {
    //     questions: questions,
    //     createdAt: new Date(),
    //   });
    //   alert('Form successfully created!');
    // } catch (error) {
    //   console.error('Error creating form:', error);
    //   alert('Failed to create form.');
    // } finally {
    //   setSaving(false);
    // }
  };

  return (
    <div className="response-box">
      <h3>Generated Questions:</h3>
      <ol>
        {questions.map((question, questionIndex) => (
          <li key={question.id}>
            <div className="input-select-container">
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                className="question-input"
              />
              <select
                value={question.type}
                onChange={(e) => handleTypeChange(questionIndex, e.target.value)}
                className="type-dropdown"
              >
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="slider">Slider</option>
                <option value="open-ended">Open-ended</option>
              </select>
            </div>
            {renderInputField(question, questionIndex)}
          </li>
        ))}
      </ol>
      <button
        className="submit-button"
        onClick={handleCreateForm}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Create Form'}
      </button>
    </div>
  );
};

export default QuestionsList;