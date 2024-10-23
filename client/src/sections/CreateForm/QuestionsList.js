import React, { useState } from 'react';
import { addDoc, collection, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import './CreateForm.css';
import { FaTrash } from 'react-icons/fa';

const QuestionsList = ({ questions, setQuestions, title }) => {
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

  const addQuestion = () => {
    const maxId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 0;
    const newQuestion = {
      id: maxId + 1, 
      question: '',
      type: 'radio',
      options: [{ value: '' }],
      poked: false,
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (index) => {
    let updatedQuestions = questions.filter((_, i) => i !== index);
    updatedQuestions = updatedQuestions.map((question, i) => ({ ...question, id: i + 1 })); 
    setQuestions(updatedQuestions);
  };

  const handleCheckboxChange = (index) => {
    const updatedQuestions = questions.map((question, i) => 
      i === index ? { ...question, poked: !question.poked } : question
    );
    setQuestions(updatedQuestions);

    // if (updatedQuestions[index].poked) {
    //   alert(`Question ${index + 1} has been poked!`);
    // }
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
                  onChange={() => { }}
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
                  onChange={() => { }}
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
        return <input type="text" placeholder="Enter your response here" />;
      default:
        return null;
    }
  };

  const handleCreateForm = async () => {
    setSaving(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You need to be logged in to create a form.');
      setSaving(false);
      return;
    }

    try {
      const userDocRef = doc(collection(db, 'users'), user.uid); 
      const formsCollectionRef = collection(userDocRef, 'forms');

      await addDoc(formsCollectionRef, {
        title: title,
        questions: questions,
        createdAt: new Date(),
      });

      alert('Form successfully created!');
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Failed to create form.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="response-box">
      <h3>Generated Questions:</h3>
      <ol>
        {questions.map((question, questionIndex) => (
          <li key={question.id} className="question-item">
            <div className="question-header">
              <div className="input-select-container">
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(questionIndex, e.target.value)}
                  className="question-input"
                  placeholder="Type your question here"
                />
                <div className="poke-container">
                  <label className="poke-label">
                    Poke
                    <input
                      type="checkbox"
                      checked={question.poked || false}
                      onChange={() => handleCheckboxChange(questionIndex)}
                      className="question-checkbox"
                    />
                  </label>
                </div>
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
                <FaTrash
                  className="delete-icon"
                  onClick={() => deleteQuestion(questionIndex)}
                />
              </div>
              
            </div>
            {renderInputField(question, questionIndex)}
          </li>
        ))}
      </ol>
      <button type="button" onClick={addQuestion} className="add-question-button">Add New Question</button>
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
