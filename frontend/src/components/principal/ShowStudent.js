import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faUserPlus } from '@fortawesome/free-solid-svg-icons';
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="student-list-container">
      <h1 className="student-list-title">🎓 Student List</h1>
      <div className="button-container">
        <Link to={`/class/${id}/add-student`}>
          <button className="add-student-button">
            <FontAwesomeIcon icon={faUserPlus} /> Add New Student
          </button>
        </Link>
      </div>
      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr className="table-header">
              <th className="expand-icon-cell"></th>
              <th className="roll-no-cell">Roll No</th>
              <th className="name-cell">Name</th>
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
                  <td className="name-cell">{`${student.firstName} ${student.lastName}`}</td>
                </tr>
                {expandedId === student._id && (
                  <tr className="student-details">
                    <td colSpan="3" className="student-details-cell">
                      <p><strong>Gender:</strong> {student.gender}</p>
                      <p><strong>Contact No:</strong> {student.contactNo}</p>
                      <p><strong>Email:</strong> {student.email}</p>
                      <p><strong>Birthdate:</strong> {formatDate(student.birthdate)}</p>
                      <p><strong>Child UID:</strong> {student.childUid}</p>
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
