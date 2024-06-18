import React, { useState } from 'react';
import axios from 'axios';

const AddImage = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image); // Ensure 'image' matches the field name expected by the server
  
      await axios.post(`${process.env.REACT_APP_API_URL}/api/addImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      alert('Image uploaded successfully');
    } catch (error) {
      alert('Failed to upload image');
    }
  };

  return (
    <div>
      <h2>Add Image</h2>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
    </div>
  );
};

export default AddImage;
