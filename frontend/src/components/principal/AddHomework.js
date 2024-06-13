import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/AddHomework.css';

const AddHomework = () => {
  const [date, setDate] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questionLink, setQuestionLink] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass);
    } else {
      setSubjects([]);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async (classId) => {
    try {
        console.log(classId);
      const response = await axios.get(`http://localhost:5000/api/subjects?class=${classId}`);
      console.log(response.data);
      setSubjects(response.data); 
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !selectedClass || !selectedSubject) {
      alert('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);
      const newHomework = {
        date,
        classId: selectedClass,
        subjectId: selectedSubject,
        title,
        description,
        questionLink, // Add the question link to the new homework object
      };

      await axios.post('http://localhost:5000/api/addHomework', newHomework);

      setLoading(false);
      alert('Homework added successfully');
      // Reset form
      setTitle('');
      setDescription('');
      setSelectedClass('');
      setSelectedSubject('');
      setDate(new Date());
      setQuestionLink(''); // Reset the question link input
    } catch (error) {
      console.error('Error adding homework:', error);
      setLoading(false);
      alert('Failed to add homework');
    }
  };

  return (
    <div className="add-homework-container">
      <h2>Add Homework</h2>
      <form onSubmit={handleSubmit} className="homework-form">
        <div className="form-group">
          <label>Date:</label>
          <DatePicker selected={date} onChange={(date) => setDate(date)} />
        </div>
        <div className="form-group">
          <label>Class:</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Subject</option>
            {subjects.map((subjectItem) => (
              <option key={subjectItem._id} value={subjectItem._id}>
                {subjectItem.subjectName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Question Link:</label>
          <input
            type="text"
            value={questionLink}
            onChange={(e) => setQuestionLink(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Adding...' : 'Add Homework'}
        </button>
      </form>
    </div>
  );
};

export default AddHomework;
