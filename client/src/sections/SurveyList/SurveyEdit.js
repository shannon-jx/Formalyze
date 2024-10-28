import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import './SurveyEdit.css'; // Add this import for custom styles

function SurveyEdit() {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
  
        if (!user) {
          throw new Error('User not authenticated');
        }
  
        const surveyDoc = await getDoc(doc(db, 'users', user.uid, 'forms', id));
  
        if (surveyDoc.exists()) {
          const surveyData = surveyDoc.data();
          const questions = surveyData.questions.map((q) => {
            const options = Array.isArray(q.options)
              ? q.options.map((option) => option.value)
              : [];
            return { ...q, options };
          });
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
  }, [id]);
  

  const handleTitleChange = (e) => {
    setSurvey({ ...survey, title: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...survey.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const addQuestion = () => {
    const newQuestion = {
      text: '',
      type: 'text',
      options: []
    };
    setSurvey({ ...survey, questions: [...survey.questions, newQuestion] });
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = survey.questions.filter((_, i) => i !== index);
    setSurvey({ ...survey, questions: updatedQuestions });
  };

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user) {
        throw new Error('User not authenticated');
      }
  
      const surveyToSave = {
        title: survey.title,
        questions: survey.questions.map((q, questionIndex) => {
          let options = q.options;
  
          if (q.type === 'multipleChoice' || q.type === 'checkbox' || q.type === 'slider') {
            options = q.options.map((option, optionIndex) => ({
              key: optionIndex,
              value: option,
            }));
          }
  
          return {
            ...q,
            options,
          };
        }),
      };
  
      await updateDoc(doc(db, 'users', user.uid, 'forms', id), surveyToSave);
  
      navigate(`/forms/${id}`);
    } catch (err) {
      console.error('Error updating survey: ', err);
      setError(err.message);
    }
  };  

  if (loading) {
    return <div>Loading form...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="survey-edit-container">
      <h1 className="survey-edit-title">Edit Form: {survey.title}</h1>
      <div className="survey-edit-form">
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
          {survey.questions && survey.questions.map((question, index) => (
            <div key={index} className={`question-card question-type-${question.type}`}>
              <div className="question-header">
                <h3>Question {index + 1}</h3>
                <button onClick={() => deleteQuestion(index)} className="btn btn-danger">Delete</button>
              </div>
              <div className="form-group">
                <label htmlFor={`question-${index}`}>Question Text</label>
                <input
                  id={`question-${index}`}
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
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
                  <option value="text">Text</option>
                  <option value="multipleChoice">Multiple Choice</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>
              {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
                <div className="options-container">
                  <h4>{question.type === 'multipleChoice' ? 'Multiple Choice Options' : 'Checkbox Options'}</h4>
                  {question.options && question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-group option-group">
                      <label htmlFor={`option-${index}-${optionIndex}`}>
                        {question.type === 'multipleChoice' ? (
                          <span className="radio-icon"></span>
                        ) : (
                          <span className="checkbox-icon"></span>
                        )}
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
          <button onClick={addQuestion} className="btn btn-primary">Add Question</button>
        </div>
        <div className="button-group">
          <button onClick={handleSave} className="btn btn-primary">Save Form</button>
          <button onClick={() => navigate(`/forms/${id}`)} className="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default SurveyEdit;
