import React, { useState } from 'react';
import axios from 'axios';

function AddComplaint() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/complaints', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'gmail': localStorage.getItem('email'), // Assuming gmail is stored in localStorage
        },
      });
      console.log(response.data);
      // Optionally, reset form fields
      setTitle('');
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error submitting complaint', error);
    }
  };

  return (
    <div className="AddComplaint">
      <h1>Submit a Complaint</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" className='button-st'>Submit</button>
      </form>
    </div>
  );
}

export default AddComplaint;
