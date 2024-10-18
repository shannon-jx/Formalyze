import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';

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
          setSurvey({ id: surveyDoc.id, ...surveyDoc.data() });
        } else {
          throw new Error('Survey not found');
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching survey: ", err);
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

  const handleSave = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('User not authenticated');
      }

      await updateDoc(doc(db, 'users', user.uid, 'forms', id), {
        title: survey.title,
        questions: survey.questions,
      });

      navigate(`/survey/${id}`);
    } catch (err) {
      console.error("Error updating survey: ", err);
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Loading survey...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="survey-edit">
      <h1>Edit Survey</h1>
      <input
        type="text"
        value={survey.title || ''}
        onChange={handleTitleChange}
        placeholder="Survey Title"
      />
      <div className="questions">
        {survey.questions && survey.questions.map((question, index) => (
          <div key={index} className="question">
            <input
              type="text"
              value={question.text}
              onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
              placeholder="Question Text"
            />
            <select
              value={question.type}
              onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
            >
              <option value="text">Text</option>
              <option value="multipleChoice">Multiple Choice</option>
              <option value="checkbox">Checkbox</option>
            </select>
            {(question.type === 'multipleChoice' || question.type === 'checkbox') && (
              <div className="options">
                {question.options && question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[optionIndex] = e.target.value;
                      handleQuestionChange(index, 'options', updatedOptions);
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
                <button onClick={() => {
                  const updatedOptions = [...(question.options || []), ''];
                  handleQuestionChange(index, 'options', updatedOptions);
                }}>Add Option</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Save Survey</button>
      <button onClick={() => navigate(`/survey/${id}`)}>Cancel</button>
    </div>
  );
}

export default SurveyEdit;
