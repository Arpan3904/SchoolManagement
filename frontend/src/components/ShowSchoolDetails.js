import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ShowSchoolDetails.css';

const ShowSchoolDetails = () => {
  const [schoolDetails, setSchoolDetails] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [userRole, setUserRole] = useState('');

  
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchSchoolDetails();
  }, []);

  const fetchSchoolDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/school-details`);
      setSchoolDetails(response.data);
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching school details:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, schoolLogo: reader.result });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/school-details`, formData);
      setSchoolDetails(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating school details:', err);
    }
  };

  return (
    <div className="school-details-container">
      <h2>School Details</h2>
      {isEditing ? (
        <div className="school-details-form">
          <div className="form-group">
            <label>Upload New School Logo:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
          <div className="form-group">
            <label>School Name:</label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>School Email:</label>
            <input
              type="email"
              name="schoolEmail"
              value={formData.schoolEmail || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>School Address:</label>
            <input
              type="text"
              name="schoolAddress"
              value={formData.schoolAddress || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>School Contact No:</label>
            <input
              type="text"
              name="schoolContactNo"
              value={formData.schoolContactNo || ''}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Principal Email:</label>
            <input
              type="email"
              name="principalEmail"
              value={formData.principalEmail || ''}
              onChange={handleChange}
            />
          </div>
          <div className="button-group">
            <button className="button-st" onClick={handleUpdate}>Update</button>
            <button className="button-st" style={{backgroundColor:"gray"}} onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="school-details-display">
          {schoolDetails.schoolLogo && (
            <div className="logo-container">
              <img src={schoolDetails.schoolLogo} alt="School Logo" className="school-logo" />
            </div>
          )}
          <div className="details-group">
            <span><p><strong>School Name:</strong> {schoolDetails.schoolName}</p></span>
            <p><strong>School Email:</strong> {schoolDetails.schoolEmail}</p>
            <p><strong>School Address:</strong> {schoolDetails.schoolAddress}</p>
            <p><strong>School Contact No:</strong> {schoolDetails.schoolContactNo}</p>
            {/* <p><strong>Principal Email:</strong> {schoolDetails.principalEmail}</p> */}
          </div>
          {userRole === 'principal' && (
            <button className="button-st" onClick={() => setIsEditing(true)}>Edit</button>
          )}        </div>
      )}
    </div>
  );
};

export default ShowSchoolDetails;
