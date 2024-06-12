import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import bwipjs from 'bwip-js';
import moment from 'moment'; // Import moment library
import '../../styles/IDCard.css';

const IDCard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [barcodeData, setBarcodeData] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/fetch-class')
      .then(response => {
        setClasses(response.data);
      })
      .catch(error => {
        console.error('Error fetching classes:', error);
      });
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios.get(`http://localhost:5000/api/fetch-students?classId=${selectedClass}`)
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => {
          console.error('Error fetching students:', error);
        });
    }
  }, [selectedClass]);

  const handleClassSelect = (event) => {
    const selectedClassId = event.target.value;
    setSelectedClass(selectedClassId);
    setSelectedStudent(null);
  };

  const handleStudentSelect = (event) => {
    const selectedStudentId = event.target.value;
    const student = students.find(student => student._id === selectedStudentId);
    setSelectedStudent(student);

    if (student) {
      setBarcodeData(student.childUid.toString());
    }
  };

  const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY'); // Format the date
  };

  const generateIDCardContent = () => {
    if (selectedStudent) {
      return (
        <div className="id-card">
          <div className="front-side">
            <div className="photo-section">
              <img src={selectedStudent.photo || 'https://via.placeholder.com/150'} alt="Student Photo" />
            </div>
            <div className="info-section">
              <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</p>
              <p><strong>Gender:</strong> {selectedStudent.gender}</p>
              <p><strong>Contact No:</strong> {selectedStudent.contactNo}</p>
              <p><strong>Email:</strong> {selectedStudent.email}</p>
            </div>
          </div>
          <div className="back-side">
            <p><strong>Birthdate:</strong> {formatDate(selectedStudent.birthdate)}</p> {/* Format the date */}
            <p><strong>Child UID:</strong> {selectedStudent.childUid}</p>
            <p><strong>Principal:</strong> {selectedStudent.principal}</p>
            <div className="barcode-scanner">
              <canvas id="barcodeCanvas"></canvas>
            </div>
          </div>
        </div>
      );
    } else {
      return <p>Select a student to view ID card</p>;
    }
  };

  useEffect(() => {
    if (barcodeData && selectedStudent) {
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
  }, [barcodeData, selectedStudent]);

  const downloadIDCard = () => {
    const idCardContent = document.querySelector('.id-card');
    const options = {
      margin: 1,
      filename: 'id_card.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(idCardContent).set(options).save();
  };

  return (
    <div className="id-card-container">
      <h2>Select Class:</h2>
      <select onChange={handleClassSelect}>
        <option value="">Select Class</option>
        {classes.map(classItem => (
          <option key={classItem._id} value={classItem._id}>
            {classItem.className}
          </option>
        ))}
      </select>

      <h2>Select Student:</h2>
      <select onChange={handleStudentSelect} disabled={!selectedClass}>
        <option value="">Select Student</option>
        {students.map(student => (
          <option key={student._id} value={student._id}>
            {student.firstName} {student.middleName} {student.lastName}
          </option>
        ))}
      </select>

      {generateIDCardContent()}

      {selectedStudent && (
        <button onClick={downloadIDCard}>Download ID Card</button>
      )}
    </div>

);
};

export default IDCard;