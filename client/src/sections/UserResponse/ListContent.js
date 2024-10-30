import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import axios from 'axios';
import './ListContent.css';
import {db} from '../firebase'; 
import { useParams } from 'react-router-dom';

const UserResponse = () => {
    const { userId, formId } = useParams();
    const [data, setData] = useState([]);
    const [formResponses, setFormResponses] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isCurrentQuestionAnswered, setIsCurrentQuestionAnswered] = useState(false);

    useEffect(() => {
        const fetchUserResponse = async () => {    
            const parentRef = doc(db, 'users', userId);
            const subcollectionRef = collection(parentRef, 'forms');
            const docRef = doc(subcollectionRef, formId);
            const fetchedData = await getDoc(docRef);
            setData(fetchedData.data());
        };
        fetchUserResponse();
    }, [userId, formId]);

    useEffect(() => {
        // Check if the current question has been answered
        if (data.questions && data.questions[currentQuestionIndex]) {
            const currentQuestionId = data.questions[currentQuestionIndex].id;
            setIsCurrentQuestionAnswered(!!formResponses[currentQuestionId]);
        }
    }, [currentQuestionIndex, formResponses, data.questions]);

    const handleInputChange = (questionId, value, isCheckbox = false) => {
        setFormResponses(prevResponses => {
            const updatedResponses = isCheckbox
                ? {
                    ...prevResponses,
                    [questionId]: Array.isArray(prevResponses[questionId])
                        ? prevResponses[questionId].includes(value)
                            ? prevResponses[questionId].filter(v => v !== value)
                            : [...prevResponses[questionId], value]
                        : [value]
                }
                : { ...prevResponses, [questionId]: value };
            
            setIsCurrentQuestionAnswered(true);
            return updatedResponses;
        });
    };

    const handleNextQuestion = async () => {
        const currentQuestion = data.questions[currentQuestionIndex];
        if (currentQuestion.type === 'open-ended' && currentQuestion.poked && formResponses[currentQuestion.id]) {
            try {
                console.log("currentQuestion",currentQuestion.question);
                console.log("answer",formResponses[currentQuestion.id]);
                const response = await axios.post('/api/poking-questions', {
                    question: currentQuestion.question,
                    answer: formResponses[currentQuestion.id]
                    
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log(response);
                
                // Create a new follow-up question object
                const followUpQuestion = {
                    id: `${currentQuestion.id}.1`,
                    type: 'open-ended',
                    question: response.data.message,
                    poked: false // We don't want to poke the follow-up question
                };
                
                // Insert the follow-up question after the current question
                setData(prevData => {
                    const newQuestions = [...prevData.questions];
                    newQuestions.splice(currentQuestionIndex + 1, 0, followUpQuestion);
                    return { ...prevData, questions: newQuestions };
                });
                
                // Move to the newly inserted follow-up question
                setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            } catch (error) {
                console.error('Error generating follow-up question:', error);
            }
        } else {
            // If it's not a poked open-ended question, just move to the next question
            setCurrentQuestionIndex(prev => Math.min(data.questions.length - 1, prev + 1));
        }
        setIsCurrentQuestionAnswered(false);
    };

    const renderInputField = (question) => {
        switch (question.type) {
            case 'radio':
                return (
                    <>
                        {question.options.map((option) => (
                            <div key={option.key} className="option-container">
                                <input
                                    type="radio"
                                    id={`${question.id}-${option.key}`}
                                    name={question.id}
                                    value={option.value || ''}
                                    onChange={() => handleInputChange(question.id, option.value)}
                                    checked={formResponses[question.id] === option.value || false}
                                />
                                <label htmlFor={`${question.id}-${option.key}`}>{option.value}</label>
                            </div>
                        ))}
                    </>
                );
            case 'checkbox':
                return (
                    <>
                        {question.options.map((option) => (
                            <div key={option.key} className="option-container">
                                <input
                                    type="checkbox"
                                    id={`${question.id}-${option.key}`}
                                    name={question.id}
                                    value={option.value || ''}
                                    onChange={() => handleInputChange(question.id, option.value, true)}
                                    checked={Array.isArray(formResponses[question.id]) ? 
                                        formResponses[question.id].includes(option.value) : false}
                                />
                                <label htmlFor={`${question.id}-${option.key}`}>{option.value}</label>
                            </div>
                        ))}
                    </>
                );
            case 'slider':
                return (
                    <input
                        type="range"
                        min="0"
                        max="10"
                        value={formResponses[question.id] || "5"}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        value={formResponses[question.id] || "5"}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                    />
                );
            case 'open-ended':
                return (
                    <textarea 
                        rows="4" 
                        cols="50"
                        value={formResponses[question.id] || ""}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                        value={formResponses[question.id] || ""}
                        onChange={(e) => handleInputChange(question.id, e.target.value)}
                    ></textarea>
                );
            default:
                return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submission started");
        console.log("Current formResponses:", formResponses);

        try {
            const userDocRef = doc(db, 'users', userId);
            const formsCollectionRef = collection(userDocRef, 'forms');
            const formDocRef = doc(formsCollectionRef, formId);
            const formData = collection(formDocRef, 'response');
            
            // Prepare submission data
            const submissionData = data.questions.map(question => {
                const questionId = String(question.id); // Ensure question.id is a string
                const isFollowUp = typeof questionId === 'string' && questionId.includes('.1');
                const response = {
                    id: questionId,
                    question: question.question,
                    type: question.type,
                    answer: formResponses[questionId] || '',
                    isFollowUp: isFollowUp
                };

                // if (isFollowUp) {
                //     response.originalQuestionId = questionId.split('.1')[0];
                // } else if (question.poked) {
                //     const followUpId = `${questionId}-followup`;
                //     response.question = data.questions.find(q => String(q.id) === followUpId)?.question || '';
                //     response.answer = formResponses[followUpId] || '';
                // }
                if (question.poked) {
                        const followUpId = `${questionId}.1`;
                        response.question = data.questions.find(q => String(q.id) === followUpId)?.question || '';
                        response.answer = formResponses[followUpId] || '';
                    }

                return response;
            });

            console.log("Attempting to add document to Firestore");
            const docRef = await addDoc(formData, {
                responses: submissionData,
                createdAt: new Date(),
            });
            console.log("Document written with ID: ", docRef.id);
            
            setFormResponses({});
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form. Please check the console for more details.');
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">{data?.title || 'Form Title'}</h1>
            {Array.isArray(data?.questions) && data.questions.length > 0 ? (
                <form onSubmit={handleSubmit}>
                    <div className="question-card">
                        <div className="question-content">
                            {data.questions[currentQuestionIndex] && (
                                <>
                                    <h3 className="question-text">{data.questions[currentQuestionIndex].question}</h3>
                                    {renderInputField(data.questions[currentQuestionIndex])}
                                </>
                            )}
                        </div>
                        
                        <div className="navigation-buttons">
                            <button 
                                type="button" 
                                className="nav-button prev-button" 
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </button>
                            
                            <button 
                                type="button" 
                                className="nav-button next-button" 
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex === data.questions.length - 1 || !isCurrentQuestionAnswered}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                    
                    {currentQuestionIndex === data.questions.length - 1 && (
                        <button type="submit" className="submit-button">Submit</button>
                    )}
                    </div>
                    
                    {currentQuestionIndex === data.questions.length - 1 && (
                        <button type="submit" className="submit-button">Submit</button>
                    )}
                </form>
            ) : (
                <p className="no-questions">No questions available</p>
            )}
        </div>
    );
};

export default UserResponse;
