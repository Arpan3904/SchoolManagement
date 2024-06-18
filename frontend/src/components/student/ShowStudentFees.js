import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowFeesComponent.css'; // Import CSS file for styling

const ShowFeesComponent = () => {
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  const fetchStudentFees = async () => {
    try {
      // Fetch student details using email
      const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetchStbyEmail?email=${userEmail}`);
      const student = studentResponse.data;

      // Fetch fee details using studentId
      const feeResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-student-fees?studentId=${student._id}`);
      setFeeDetails(feeResponse.data);
    } catch (error) {
      console.error('Error fetching fee details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentFees();
  }, [userEmail]);

  const handlePayFees = async (amount, studentId) => {
    try {
      const orderResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/create-order`, { amount, studentId });
      const { id: order_id, currency } = orderResponse.data;

      const options = {
        key: 'rzp_test_UXwDn93TnrUjql', // Enter the Key ID generated from the Dashboard
        amount: amount * 100, // Amount is in currency subunits
        currency: currency,
        name: 'Your App Name',
        description: 'Fee Payment',
        order_id: order_id,
        handler: async function (response) {
          alert('Payment successful');
          // Update payment status in the database
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/update-payment-status`, {
              studentId,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            // Fetch the updated fee details
            fetchStudentFees();
          } catch (updateError) {
            console.error('Error updating payment status:', updateError);
            alert('Failed to update payment status');
          }
        },
        prefill: {
          name: 'Your Name',
          email: userEmail,
          contact: 'Your Phone Number',
        },
        notes: {
          address: 'Your Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error creating order or handling payment:', error);
      alert('Failed to initiate payment');
    }
  };

  return (
    <div className="fees-container">
      <h2 className="fees-heading">Fee Details</h2>
      {loading ? (
        <div className="loading-spinner">Loading...</div> // Add loading spinner while fetching data
      ) : (
        <table className="fees-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {feeDetails.length > 0 ? (
              feeDetails.map((fee, index) => (
                <tr key={index}>
                  <td>{fee.amount}</td>
                  <td>{new Date(fee.dueDate).toLocaleDateString()}</td>
                  <td>{fee.paymentStatus}</td>
                  <td>
                    {fee.paymentStatus === 'Pending' && (
                      <button className="pay-fees-button" onClick={() => handlePayFees(fee.amount, fee.studentId)}>
                        Pay Fees
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No fee details available.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowFeesComponent;
