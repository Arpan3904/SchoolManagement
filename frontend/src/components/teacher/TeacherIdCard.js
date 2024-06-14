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

  useEffect(() => {
    axios.get('http://localhost:5000/api/fetch-teachers')
      .then(response => {
        setTeachers(response.data);
      })
      .catch(error => {
        console.error('Error fetching teachers:', error);
      });
  }, []);

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
            <div className="photo-section">
              <img src={selectedTeacher.photo || 'https://via.placeholder.com/150'} alt="Teacher Photo" />
            </div>
            <div className="info-section">
              <p><strong>Name:</strong> {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
              <p><strong>Degree:</strong> {selectedTeacher.degree}</p>
              <p><strong>Subject:</strong> {selectedTeacher.subject}</p>
              <p><strong>Contact No:</strong> {selectedTeacher.contactNo}</p>
              <p><strong>Email:</strong> {selectedTeacher.email}</p>
            </div>
          </div>
          <div className="back-side">
            <p><strong>User Role:</strong> {selectedTeacher.userRole}</p>
            <p><strong>Principal:</strong> {selectedTeacher.principal}</p>
            <div className="barcode-scanner">
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
      <h2>Select Teacher:</h2>
      <select onChange={handleTeacherSelect}>
        <option value="">Select Teacher</option>
        {teachers.map(teacher => (
          <option key={teacher._id} value={teacher._id}>
            {teacher.firstName} {teacher.lastName}
          </option>
        ))}
      </select>

      {generateIDCardContent()}

      {selectedTeacher && (
        <button onClick={downloadIDCard}>Download ID Card</button>
      )}
    </div>
  );
};

export default TeacherIDCard;
