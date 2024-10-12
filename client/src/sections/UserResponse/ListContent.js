import React,{useState,useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import {collection, getDoc, doc} from 'firebase/firestore';
import {getFirestore} from 'firebase/firestore';
import './ListContent.css';

const firebaseConfig = {
    apiKey: "AIzaSyDkRl-rXPp3nCHwxrP3yfY0eAXnh_fmk30",
    authDomain: "formalyze-ec725.firebaseapp.com",
    projectId: 'formalyze-ec725',
    storageBucket: "formalyze-ec725.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "1:1037229349268:web:ac131cca3befa5edced781",
  };
  
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const FetchData = () => {
    const [data,setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const parentRef = doc(db,'users','4erRSCcQXnb9BQ8DkWuoeii5Wsw2');
            const subcollectionRef = collection(parentRef,'forms');
            const docRef = doc(subcollectionRef,'Snzkkr39WpPrJcSbRqlM');
            const fetchedData = await getDoc(docRef);
            setData(fetchedData.data());
           
        };
        fetchData();
       
    
    }, []);
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
                    />
                );
            case 'open-ended':
                return <textarea rows="4" cols="50"></textarea>;
            default:
                return null;
        }
    };
    return (
   
        <div className="form-container">
        <h1 className="form-title">{data.title || 'Form Title'}</h1>
        {Array.isArray(data.questions) ? (
            <form onSubmit={(e) => e.preventDefault()}>
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
