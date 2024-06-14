import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import bwipjs from 'bwip-js';
import moment from 'moment';
import '../../styles/IDCard.css';

const TeacherIDCard = () => {
  const [teacher, setTeacher] = useState(null);
  const [barcodeData, setBarcodeData] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    
    axios.get('http://localhost:5000/api/fetch-teacher-by-email', {
      params: { email }
    })
    .then(response => {
      setTeacher(response.data);
      setBarcodeData(response.data.contactNo.toString());
    })
    .catch(error => {
      console.error('Error fetching teacher:', error);
    });
  }, [email]);

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
  };

  const generateIDCardContent = () => {
    if (teacher) {
      return (
        <div className="id-card">
          <div className="front-side">
            <div className="photo-section">
              <img src={teacher.photo || 'https://via.placeholder.com/150'} alt="Teacher Photo" />
            </div>
            <div className="info-section">
              <p><strong>Name:</strong> {teacher.firstName} {teacher.lastName}</p>
              <p><strong>Degree:</strong> {teacher.degree}</p>
              <p><strong>Subject:</strong> {teacher.subject}</p>
              <p><strong>Contact No:</strong> {teacher.contactNo}</p>
              <p><strong>Email:</strong> {teacher.email}</p>
            </div>
          </div>
          <div className="back-side">
            <p><strong>User Role:</strong> {teacher.userRole}</p>
            <p><strong>Principal:</strong> {teacher.principal}</p>
            <div className="barcode-scanner">
              <canvas id="barcodeCanvas"></canvas>
            </div>
          </div>
        </div>
      );
    } else {
      return <p>Loading teacher data...</p>;
    }
  };

  useEffect(() => {
    if (barcodeData && teacher) {
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
  }, [barcodeData, teacher]);

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
      <h2>Teacher ID Card</h2>
      {generateIDCardContent()}
      {teacher && (
        <button onClick={downloadIDCard}>Download ID Card</button>
      )}
    </div>
  );
};

export default TeacherIDCard;
