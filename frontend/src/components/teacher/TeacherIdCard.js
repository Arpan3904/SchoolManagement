import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import bwipjs from 'bwip-js';
import moment from 'moment';
import '../../styles/IDCard.css';

const TeacherIDCard = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [barcodeData, setBarcodeData] = useState('');
  const [schoolDetails, setSchoolDetails] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/school-details`);
        setSchoolDetails(response.data);
      } catch (error) {
        console.error('Error fetching school details:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-teachers`);
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchSchoolDetails();
    if (userRole === 'teacher') {
      fetchTeacherDetails();
    } else {
      fetchTeachers();
    }
  }, [userRole, email]);

  const fetchTeacherDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-teacher-by-email`, {
        params: { email }
      });
      setSelectedTeacher(response.data);
      setBarcodeData(response.data.contactNo.toString());
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  const handleTeacherSelect = (event) => {
    const selectedTeacherId = event.target.value;
    const teacher = teachers.find(teacher => teacher._id === selectedTeacherId);
    setSelectedTeacher(teacher);

    if (teacher) {
      setBarcodeData(teacher.contactNo.toString());
    }
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const generateIDCardContent = () => {
    if (selectedTeacher) {
      return (
        <div className="id-card">
          <div className="front-side">
            <div className="header">
              {schoolDetails && (
                <>
                  <img src={schoolDetails.schoolLogo} alt="School Logo" className="school-logo" />
                  <h2 style={{ marginRight: '120px', fontSize: '35px' }}>{schoolDetails.schoolName}</h2>
                </>
              )}
            </div>
            <hr />
            <h3 className="id-card-title"><u>IDENTITY CARD</u></h3>
            <div className="content">
              <div className="photo-section">
                <img src={selectedTeacher.photo || 'https://via.placeholder.com/150'} alt="Teacher Photo" />
              </div>
              <div className="info-section">
                <p><strong>Name:</strong> {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                <p><strong>Degree:</strong> {selectedTeacher.degree}</p>
                <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
                {schoolDetails && <p><strong>School Address:</strong> {schoolDetails.schoolAddress}</p>}
                <p><strong>Contact No:</strong> {selectedTeacher.contactNo}</p>
                <p><strong>Email:</strong> {selectedTeacher.email}</p>
              </div>
            </div>
          </div>
          <div className="back-side">
            <div className="terms-conditions">
              <h4>Terms and Conditions</h4>
              <ul>
                <li>This card is the property of the school.</li>
                <li>Loss of the card must be reported immediately.</li>
                <li>Misuse of the card will result in disciplinary action.</li>
                <li>This card must be carried at all times within the school premises.</li>
              </ul>
            </div>
            <div className="barcode-section">
              <canvas id="barcodeCanvas"></canvas>
            </div>
          </div>
        </div>
      );
    } else {
      return <p>Select a teacher to view ID card</p>;
    }
  };

  useEffect(() => {
    if (barcodeData && selectedTeacher) {
      const canvas = document.getElementById('barcodeCanvas');
      bwipjs.toCanvas(canvas, {
        bcid: 'code128',
        text: barcodeData,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center'
      });
    }
  }, [barcodeData, selectedTeacher]);

  const downloadIDCard = () => {
    const idCardContent = document.querySelector('.id-card');
    const options = {
      margin: 1,
      filename: 'teacher_id_card.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(idCardContent).set(options).save();
  };

  return (
    <div className="id-card-container">
      {userRole !== 'teacher' && (
        <>
          <h2>Select Teacher:</h2>
          <select onChange={handleTeacherSelect}>
            <option value="">Select Teacher</option>
            {teachers.map(teacher => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.firstName} {teacher.lastName}
              </option>
            ))}
          </select>
        </>
      )}

      {generateIDCardContent()}

      {selectedTeacher && (
        <button className="button-st" onClick={downloadIDCard}>Download ID Card</button>
      )}
    </div>
  );
};

export default TeacherIDCard;
