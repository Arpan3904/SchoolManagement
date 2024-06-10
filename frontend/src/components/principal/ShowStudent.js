import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faUserPlus, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams } from 'react-router-dom';
import '../../styles/ShowStudent.css';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/fetch-students?classId=${id}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [id]);

  const toggleExpanded = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="student-list-container">
      <h1 className="student-list-title">Student List</h1>
      <div className="button-container">
        <Link to={`/class/${id}/add-student`}>
          <button className="add-student-button">
            <FontAwesomeIcon icon={faUserPlus} /> Add Student
          </button>
        </Link>
        <Link to={`/class/${id}/take-attendance`}>
          <button className="take-attendance-button">
            <FontAwesomeIcon icon={faClipboardCheck} /> Take Attendance
          </button>
        </Link>
      </div>
      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr className="table-header">
              <th className="expand-icon-cell"></th>
              <th className="roll-no-cell">Roll No</th>
              <th className="first-name-cell">First Name</th>
              <th className="middle-name-cell">Middle Name</th>
              <th className="last-name-cell">Last Name</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <React.Fragment key={student._id}>
                <tr className="student-item" onClick={() => toggleExpanded(student._id)}>
                  <td className="expand-icon-cell">
                    <FontAwesomeIcon icon={expandedId === student._id ? faAngleDown : faAngleRight} />
                  </td>
                  <td className="roll-no-cell">{student.rollNo}</td>
                  <td className="first-name-cell">{student.firstName}</td>
                  <td className="middle-name-cell">{student.middleName}</td>
                  <td className="last-name-cell">{student.lastName}</td>
                </tr>
                {expandedId === student._id && (
                  <tr className="student-details">
                    <td colSpan="5" className="student-details-cell">
                      <p>Gender: {student.gender}</p>
                      <p>Contact No: {student.contactNo}</p>
                      <p>Email: {student.email}</p>
                      <p>Birthdate: {student.birthdate}</p>
                      <p>Child UID: {student.childUid}</p>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
