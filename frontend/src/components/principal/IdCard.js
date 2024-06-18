import React, { useState, useEffect } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import bwipjs from 'bwip-js';
import moment from 'moment';
import '../../styles/IDCard.css';

const IDCard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [barcodeData, setBarcodeData] = useState('');
  const [schoolDetails, setSchoolDetails] = useState(null);
  const userRole = localStorage.getItem('userRole'); // Retrieve user role from localStorage
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/school-details`);
        setSchoolDetails(response.data);
      } catch (error) {
        console.error('Error fetching school details:', error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-class`);
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    const fetchStudentDetails = async (email) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-student-by-email?email=${email}`);
        const student = response.data;
        setSelectedStudent(student);
        setSelectedClass(student.classId);
        setBarcodeData(student.childUid.toString());
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchSchoolDetails();

    if (userRole === 'student' && userEmail) {
      fetchStudentDetails(userEmail);
    } else {
      fetchClasses();
    }
  }, [userRole, userEmail]);

  useEffect(() => {
    if (selectedClass && userRole !== 'student') {
      axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-students?classId=${selectedClass}`)
        .then(response => {
          setStudents(response.data);
        })
        .catch(error => {
          console.error('Error fetching students:', error);
        });
    }
  }, [selectedClass, userRole]);

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
    return moment(date).format('DD/MM/YYYY');
  };

  const generateIDCardContent = () => {
    if (selectedStudent) {
      return (
        <div className="id-card">
          <div className="front-side">
            <div className="header">
              {schoolDetails && (
                <>
                  <img src={schoolDetails.schoolLogo} alt="School Logo" className="school-logo" />
                  <h2 style={{marginRight:'120px',fontSize:'35px'}}>{schoolDetails.schoolName}</h2>
                </>
              )}
               
            </div>
            
            <h3 className="id-card-title"><u>IDENTITY CARD</u></h3>
            <div className="content">
              <div className="photo-section">
                <img src={selectedStudent.photo || 'https://via.placeholder.com/150'} alt="Student Photo" />
              </div>
             
              <div className="info-section">
                <p><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</p>
                <p><strong>DOB:</strong> {formatDate(selectedStudent.birthdate)}</p>
                {schoolDetails && <p><strong>School Address:</strong> {schoolDetails.schoolAddress}</p>}
                <p><strong>Phone Number:</strong> {selectedStudent.contactNo}</p>
                <p><strong>Email:</strong> {selectedStudent.email}</p>
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
      {userRole !== 'student' && (
        <>
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
        </>
      )}

      {generateIDCardContent()}

      {selectedStudent && (
        <button className="button-st" onClick={downloadIDCard}>Download ID Card</button>
      )}
    </div>
  );
};

export default IDCard;
