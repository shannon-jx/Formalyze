// src/sections/Dashboard/components/EditView.js
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Adjust the path based on actual location
// import './EditView.css'; // Create and style as needed

function EditView({ formId, userId }) {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const formRef = doc(db, 'users', userId, 'forms', formId);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          setFormData(formSnap.data());
        } else {
          setError('Form not found');
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching form data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (userId && formId) {
      fetchFormData();
    }
  }, [formId, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const formRef = doc(db, 'users', userId, 'forms', formId);
      await updateDoc(formRef, formData);
      alert('Form updated successfully!');
    } catch (err) {
      console.error("Error updating form:", err);
      alert(`Error updating form: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading form data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="edit-view">
      <h3>Edit Form</h3>
      <form>
        <div className="form-group">
          <label>Title:</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title || ''} 
            onChange={handleInputChange} 
          />
        </div>
        {/* Add more form fields as needed */}
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}

export default EditView;
