import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddSyllabus = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [syllabus, setSyllabus] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/classes');
                setClasses(response.data);
            } catch (err) {
                console.error('Error fetching classes:', err);
            }
        };

        fetchClasses();
    }, []);

    const handleClassChange = async (e) => {
        const selectedClass = e.target.value;
        setSelectedClass(selectedClass);
        setSelectedSubject('');
        setSyllabus('');

        try {
            const response = await axios.get(`http://localhost:5000/api/subjects?class=${selectedClass}`);
            setSubjects(response.data);
        } catch (err) {
            console.error('Error fetching subjects:', err);
        }
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleSyllabusChange = (e) => {
        setSyllabus(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/add-syllabus', {
                className: selectedClass,
                subject: selectedSubject,
                syllabus: syllabus
            });
            alert('Syllabus added successfully');
            setSelectedClass('');
            setSelectedSubject('');
            setSyllabus('');
        } catch (err) {
            console.error('Error adding syllabus:', err);
            alert('Failed to add syllabus');
        }
    };

    return (
        <div className="container">
            <h1>Add Syllabus</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Class:</label>
                    <select value={selectedClass} onChange={handleClassChange}>
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls._id} value={cls.className}>
                                {cls.className}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Select Subject:</label>
                    <select value={selectedSubject} onChange={handleSubjectChange} disabled={!selectedClass}>
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject._id} value={subject.subjectName}>
                                {subject.subjectName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Syllabus:</label>
                    <textarea value={syllabus} onChange={handleSyllabusChange} disabled={!selectedSubject}></textarea>
                </div>
                <button type="submit" className="button-st">Save Syllabus</button>
            </form>
        </div>
    );
};

export default AddSyllabus;
