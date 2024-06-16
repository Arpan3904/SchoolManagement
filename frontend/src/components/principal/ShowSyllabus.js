import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ShowSyllabus = () => {
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [syllabus, setSyllabus] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/classes');
                setClasses(response.data);
            } catch (err) {
                console.error('Error fetching classes:', err);
                setError('Failed to fetch classes');
            }
        };

        fetchClasses();
    }, []);

    const handleClassChange = async (e) => {
        const selectedClass = e.target.value;
        setSelectedClass(selectedClass);
        setSelectedSubject('');
        setSyllabus('');
        setError('');

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/subjects?class=${selectedClass}`);
            setSubjects(response.data);
        } catch (err) {
            console.error('Error fetching subjects:', err);
            setError('Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    };

    const handleSubjectChange = async (e) => {
        const selectedSubject = e.target.value;
        setSelectedSubject(selectedSubject);
        setSyllabus('');
        setError('');

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/syllabus?className=${selectedClass}&subject=${selectedSubject}`);
            if (response.data && response.data.syllabus) {
                setSyllabus(response.data.syllabus);
            } else {
                setSyllabus('Syllabus is not available');
            }
        } catch (err) {
            console.error('Error fetching syllabus:', err);
            setError('Failed to fetch syllabus');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSyllabus = () => {
        navigate('/add-syllabus');
    };

    return (
        <div className="container">
            <h1>Show Syllabus</h1>
            {error && <div className="error-message">{error}</div>}
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
            {selectedClass && (
                <div className="form-group">
                    <label>Select Subject:</label>
                    <select value={selectedSubject} onChange={handleSubjectChange}>
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject._id} value={subject.subjectName}>
                                {subject.subjectName}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {syllabus && (
                <div className="syllabus-container">
                    <h2>Syllabus</h2>
                    <p>{syllabus}</p>
                </div>
            )}
            <button onClick={handleAddSyllabus} className="button-st">Add Syllabus</button>
        </div>
    );
};

export default ShowSyllabus;
