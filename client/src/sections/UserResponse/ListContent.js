import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import './ListContent.css';
import {db} from '../firebase'; 

const FetchData = () => {
    const [data, setData] = useState([]);
    const [formResponses, setFormResponses] = useState({});
    const userid = "4erRSCcQXnb9BQ8DkWuoeii5Wsw2";

    useEffect(() => {
        const fetchData = async () => {
            const parentRef = doc(db, 'users', '4erRSCcQXnb9BQ8DkWuoeii5Wsw2');
            const subcollectionRef = collection(parentRef, 'forms');
            const docRef = doc(subcollectionRef, 'Snzkkr39WpPrJcSbRqlM');
            const fetchedData = await getDoc(docRef);
            setData(fetchedData.data());

        };
        fetchData();


    }, []);

    const handleCheckboxChange = (questionId, value, checked) => {
        setFormResponses(prevResponses => {
            const updatedCheckboxValues = Array.isArray(prevResponses[questionId]) ? prevResponses[questionId] : [];
            if (checked) {
                // Add value if it's checked
                return {
                    ...prevResponses,
                    [questionId]: [...updatedCheckboxValues, value],
                };
            } else {
                // Remove value if it's unchecked
                return {
                    ...prevResponses,
                    [questionId]: updatedCheckboxValues.filter((val) => val !== value),
                };
            }
        });
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
                                    value={option.value}
                                    onChange={(e) => setFormResponses(prev => ({...prev, [question.id]: e.target.value}))}
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
                                    value={option.value}
                                    onChange={(e) => handleCheckboxChange(question.id, option.value, e.target.checked)}
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
                        defaultValue="5"
                        onChange={(e) => setFormResponses(prev => ({...prev, [question.id]: e.target.value}))}
                    />
                );
            case 'open-ended':
                return (
                    <textarea 
                        rows="4" 
                        cols="50"
                        onChange={(e) => setFormResponses(prev => ({...prev, [question.id]: e.target.value}))}
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
            const userDocRef = doc(db, 'users', userid);
            const formsCollectionRef = collection(userDocRef, 'forms');
            const formDocRef = doc(formsCollectionRef, "Snzkkr39WpPrJcSbRqlM");
            const formData = collection(formDocRef, 'response');
            
            console.log("Attempting to add document to Firestore");
            const docRef = await addDoc(formData, {
                answers: formResponses,
                createdAt: new Date(),
            });
            console.log("Document written with ID: ", docRef.id);
            
            // Clear form responses after successful submission
            setFormResponses({});
            alert('Form submitted successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while submitting the form. Please check the console for more details.');
        }
    };

    return (
        <div className="form-container">
            <h1 className="form-title">{data.title || 'Form Title'}</h1>
            {Array.isArray(data.questions) ? (
                <form onSubmit={handleSubmit}>
                    {data.questions.map((question) => (
                        <div key={question.id} className="question-container">
                            <h3 className="question-text">{question.question}</h3>
                            {renderInputField(question)}
                        </div>
                    ))}
                    <button type="submit" className="submit-button">Submit</button>
                </form>
            ) : (
                <p className="no-questions">No questions available</p>
            )}
        </div>
    );
};

export default FetchData;
