import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowFeePayment.css'; // Import CSS file for styling

const ShowFeePayment = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetch-class');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setSelectedStudent(null);
    setFeeDetails([]);
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/fetch-students?classId=${classId}`);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentClick = async (studentId) => {
    setSelectedStudent(studentId);
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:5000/api/fetch-fee-details?studentId=${studentId}`);
      setFeeDetails(response.data);
    } catch (error) {
      console.error('Error fetching fee details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="show-fee-payment-container">
      <h2 className="heading">Fee Payment Details</h2>
      <div className="form-group">
        <label htmlFor="class-select">Select Class:</label>
        <select id="class-select" value={selectedClass} onChange={handleClassChange}>
          <option value="">Select Class</option>
          {classes.map((classItem) => (
            <option key={classItem._id} value={classItem._id}>{classItem.className}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="loading-spinner">Loading...</div> // Add loading spinner while fetching data
      ) : (
        selectedClass && (
          <table className="students-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <React.Fragment key={student._id}>
                  <tr onClick={() => handleStudentClick(student._id)}>
                    <td>{student.rollNo}</td>
                    <td>{`${student.firstName} ${student.lastName}`}</td>
                    <td>
                      <button className="view-details-button" onClick={() => handleStudentClick(student._id)}>View Details</button>
                    </td>
                  </tr>
                  {selectedStudent === student._id && (
                    <tr className="fee-details-row">
                      <td colSpan="3">
                        {feeDetails.length > 0 ? (
                          <table className="fee-details-table">
                            <thead>
                              <tr>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Payment Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {feeDetails.map((fee, index) => (
                                <tr key={index}>
                                 <td>{fee.amount}</td>
                                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                                  <td>{fee.paymentStatus}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No fee details available.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default ShowFeePayment;
