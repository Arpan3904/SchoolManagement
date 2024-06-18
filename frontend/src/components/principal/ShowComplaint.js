import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/ShowComplaints.css'; // Import CSS file for styling

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-complaints`);
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  const toggleImageModal = (image) => {
    setSelectedImage(image);
    setShowImage(!showImage);
  };

  const deleteComplaint = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this complaint?');
    if (!confirmDelete) {
      return; // Do nothing if user cancels the confirmation
    }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/complaints/${id}`);
      // After deleting the complaint, fetch the updated list of complaints
      fetchComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  return (
    <div>
      <h2>Complaints</h2>
      <table className="complaints-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Image</th>
            <th>Created by</th>
            <th>Created at</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(complaint => (
            <tr key={complaint._id}>
              <td>{complaint.title}</td>
              <td>{complaint.content}</td>
              <td>
                {complaint.image && 
                  <button className="eye-button" onClick={() => toggleImageModal(complaint.image)}>👁️</button>
                }
              </td>
              <td>{complaint.createdBy}</td>
              <td>{new Date(complaint.createdAt).toLocaleString()}</td>
              <td>
                <button className="tick-button" onClick={() => deleteComplaint(complaint._id)}>✔️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showImage && 
        <div className="modal">
          <span className="close" onClick={() => setShowImage(false)}>&times;</span>
          <img src={`data:image/jpeg;base64,${selectedImage}`} alt="Complaint" className="modal-image" />
        </div>
      }
    </div>
  );
}

export default Complaints;
