import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddNotice.css';

const AddNotice = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClasses, setTargetClasses] = useState([]);
  const [targetAudience, setTargetAudience] = useState('students');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [message, setMessage] = useState('');

  const handleClassChange = (event) => {
    const { options } = event.target;
    const selectedClasses = [];
    for (let i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        selectedClasses.push(options[i].value);
      }
    }
    setTargetClasses(selectedClasses);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/saveNotice', {
        title,
        content,
        targetClasses,
        targetAudience,
        additionalInfo
      });
      setMessage(response.data.message);
      clearForm();
    } catch (error) {
      console.error('Error saving notice:', error);
      setMessage('An error occurred while saving the notice.');
    }
  };

  const clearForm = () => {
    setTitle('');
    setContent('');
    setTargetClasses([]);
    setTargetAudience('students');
    setAdditionalInfo('');
  };

  return (
    <div className="container">
      <h2>Add Notice</h2>
      {message && <p>{message}</p>}
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
          <label>Target Classes:</label>
          <select multiple value={targetClasses} onChange={handleClassChange} required>
            <option value="class-1">class-1</option>
            <option value="class-2">class-2</option>
            <option value="class-3">class-3</option>
            <option value="class-4">class-4</option>
            <option value="class-5">class-5</option>
            <option value="class-6">class-6</option>
            <option value="class-7">class-7</option>
            <option value="class-8">class-8</option>
            <option value="class-9">class-9</option>
            <option value="class-10">class-10</option>
            {/* Add more class options as needed */}
          </select>
        </div>
        <div>
          <label>Target Audience:</label>
          <select
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            required
          >
            <option value="students">Students</option>
            <option value="teachers">Teachers</option>
            <option value="both">Both</option>
          </select>
        </div>
        <div>
          <label>Additional Info:</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
        <button type="submit">Save Notice</button>
      </form>
    </div>
  );
};

export default AddNotice;
