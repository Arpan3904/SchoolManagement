import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/ShowFees.css'; // Import CSS file for styling

const ShowFeesComponent = () => {
  const [fees, setFees] = useState([]);
  const [studentClass, setStudentClass] = useState('');
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('userRole'); // Retrieve user role from localStorage
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetch-fees');
        setFees(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching fees:', error);
        setLoading(false);
      }
    };

    const fetchStudentClassDetails = async (email) => {
      try {
        const studentResponse = await axios.get(`http://localhost:5000/api/fetchStbyEmail?email=${email}`);
        const student = studentResponse.data;
        const classResponse = await axios.get(`http://localhost:5000/api/class/${student.classId}`);
        setStudentClass(classResponse.data.className);
      } catch (err) {
        console.error('Error fetching student or class data:', err);
      }
    };

    if (userRole === 'student' && userEmail) {
      fetchStudentClassDetails(userEmail).then(fetchFees);
    } else {
      fetchFees();
    }
  }, [userRole, userEmail]);

  const filteredFees = userRole === 'student'
    ? fees.filter(fee => fee.className === studentClass)
    : fees;

  return (
    <div className="fees-container">
      <h2 className="fees-heading">Fees Details</h2>
      {userRole !== 'student' && (
        <Link to="/add-fee" className="add-fee-link">
          <button className="add-fee-button">Add Fees</button>
        </Link>
      )}
      {loading ? (
        <div className="loading-spinner"></div> // Add loading spinner while fetching data
      ) : (
        <table className="fees-table">
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.map((fee, index) => (
              <tr key={index}>
                <td>{fee.className}</td>
                <td>{fee.feeAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowFeesComponent;
