// src/sections/Dashboard/components/EditView.js
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on actual location
import './EditView.css'; // Create and style as needed

function EditView({ formId, userId, navigate }) {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const surveyDoc = await getDoc(doc(db, 'users', userId, 'forms', formId));

        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          const questions = surveyData.questions.map((q) => ({
            ...q,
            options: Array.isArray(q.options) ? q.options.map((option) => option.value) : [],
          }));
          setSurvey({ id: surveyDoc.id, ...surveyData, questions });
        } else {
          throw new Error('Survey not found');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching survey: ', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [formId, userId]);

  const handleTitleChange = (e) => {
    setSurvey({ ...survey, title: e.target.value });
  };

  const addQuestion = () => {
    const maxId = survey.questions.reduce((max, question) => Math.max(max, question.id || 0), 0);

    const newQuestion = {
      id: maxId + 1,
      question: '', 
      type: 'open-ended',
      options: [],
    };
    setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
  };
  
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setSurvey({ ...survey, questions: updatedQuestions });
  };  

  const deleteQuestion = (index) => {
    const updatedQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const surveyToSave = {
        title: survey.title,
        questions: survey.questions.map((q, questionIndex) => ({
          ...q,
          options: q.type === 'radio' || q.type === 'checkbox' || q.type === 'slider'
            ? q.options.map((option, optionIndex) => ({ key: optionIndex, value: option }))
            : [],
        })),
      };

      await updateDoc(doc(db, 'users', userId, 'forms', formId), surveyToSave);
      // Navigate back to the form view or another appropriate page
      navigate(`/forms/${formId}`);
    } catch (err) {
      console.error('Error updating survey: ', err);
      setError(err.message);
    }
  };

  if (loading) return <div>Loading form...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-view-container">
      <div className="edit-view-form">
        <div className="form-group">
          <label htmlFor="formTitle">Form Title</label>
          <input
            id="formTitle"
            type="text"
            value={survey.title || ''}
            onChange={handleTitleChange}
            placeholder="Enter form title"
            className="form-control"
          />
        </div>
        <div className="questions-container">
          <h2>Questions</h2>
          {survey.questions &&
            survey.questions.map((question, index) => (
              <div key={index} className={`question-card question-type-${question.type}`}>
                <div className="question-header">
                  <h3>Question {index + 1}</h3>
                  <button onClick={() => deleteQuestion(index)} className="btn btn-danger">
                    Delete
                  </button>
                </div>
                <div className="form-group">
                  <label htmlFor={`question-${index}`}>Question Text</label>
                  <input
                    id={`question-${index}`}
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                    placeholder="Enter question text"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`question-type-${index}`}>Question Type</label>
                  <select
                    id={`question-type-${index}`}
                    value={question.type}
                    onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                    className="form-control"
                  >
                    <option value="radio">Radio</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="slider">Slider</option>
                    <option value="open-ended">Open-ended</option>
                  </select>
                </div>
                {(question.type === 'radio' || question.type === 'checkbox') && (
                  <div className="options-container">
                    <h4>Options</h4>
                    {question.options &&
                      question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="form-group option-group">
                          <label htmlFor={`option-${index}-${optionIndex}`}>
                            <span className={question.type === 'radio' ? 'radio-icon' : 'checkbox-icon'}></span>
                            Option {optionIndex + 1}
                          </label>
                          <input
                            id={`option-${index}-${optionIndex}`}
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...question.options];
                              updatedOptions[optionIndex] = e.target.value;
                              handleQuestionChange(index, 'options', updatedOptions);
                            }}
                            placeholder={`Enter option ${optionIndex + 1}`}
                            className="form-control"
                          />
                        </div>
                      ))}
                    <button
                      onClick={() => {
                        const updatedOptions = [...(question.options || []), ''];
                        handleQuestionChange(index, 'options', updatedOptions);
                      }}
                      className="btn btn-secondary"
                    >
                      Add Option
                    </button>
                  </div>
                )}
              </div>
            ))}
          <button onClick={addQuestion} className="btn btn-primary">
            Add Question
          </button>
        </div>
        <div className="button-group">
          <button onClick={handleSave} className="btn btn-primary">
            Save Form
          </button>
          <button onClick={() => navigate(`/forms/${formId}`)} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditView;
