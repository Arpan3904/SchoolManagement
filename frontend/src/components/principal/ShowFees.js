import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/ShowFees.css'; // Import CSS file for styling

const ShowFeesComponent = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch fees from backend API
    axios.get('http://localhost:5000/api/fetch-fees')
      .then(response => {
        setFees(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching fees:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fees-container">
      <h2 className="fees-heading">Fees Details</h2>
      <Link to="/add-fee" className="add-fee-link">
        <button className="add-fee-button">Add Fees</button>
      </Link>
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
            {fees.map((fee, index) => (
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
