import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on actual location
import QRCode from 'qrcode';
import './SurveyList.css'; // Ensure correct path

function SurveysList({ selectedFormId, setSelectedFormId, userId }) {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareQRCode, setShareQRCode] = useState({}); // Track QR codes visibility

  useEffect(() => {
    const fetchSurveys = async () => {
      if (!userId) return;
      try {
        const q = query(collection(db, 'users', userId, 'forms'));
        const querySnapshot = await getDocs(q);
        const surveysData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSurveys(surveysData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching surveys: ", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [userId]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this survey?')) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'forms', id));
        setSurveys(surveys.filter(survey => survey.id !== id));
        if (selectedFormId === id) {
          setSelectedFormId(null);
        }
      } catch (err) {
        console.error("Error deleting survey: ", err);
        setError(err.message);
      }
    }
  };

  const handleShareToggle = async (id) => {
    if (shareQRCode[id]) {
      // Hide QR code if already visible
      setShareQRCode((prev) => ({ ...prev, [id]: null }));
    } else {
      // Generate and show QR code for the form response entry page
      const url = `https://formalyze-frontend.vercel.app/user-response/${userId}/${id}`;
      try {
        const generatedQrCode = await QRCode.toDataURL(url);
        setShareQRCode((prev) => ({ ...prev, [id]: generatedQrCode }));
      } catch (error) {
        console.error("QR Code generation failed", error);
      }
    }
  };

  const copyLink = (id) => {
    const url = `https://formalyze-frontend.vercel.app/user-response/${userId}/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleSurveyClick = (id) => {
    setSelectedFormId(id);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return <div className="loading">Loading forms...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <ul className="form-list">
      {surveys.length === 0 ? (
        <li className="no-surveys">You haven't created any forms yet.</li>
      ) : (
        surveys.map(survey => (
          <li
            key={survey.id}
            className={selectedFormId === survey.id ? 'active' : ''}
            onClick={() => handleSurveyClick(survey.id)}
          >
            <span>{survey.title || 'Untitled Form'}</span>
            <div className="survey-actions">
              <button onClick={(e) => { e.stopPropagation(); handleDelete(survey.id); }}>Delete</button>
              <button onClick={(e) => { e.stopPropagation(); handleShareToggle(survey.id); }}>Share</button>
            </div>
            {shareQRCode[survey.id] && (
              <div className="qr-container">
                <img src={shareQRCode[survey.id]} alt="QR Code" className="qr-code" />
                <button onClick={(e) => { e.stopPropagation(); copyLink(survey.id); }} className="copy-link-button">
                  Copy Link
                </button>
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  );
}

export default SurveysList;
