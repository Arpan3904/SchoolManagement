import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentPanel = () => {
    const [studentClass, setStudentClass] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [syllabus, setSyllabus] = useState('');
    const [classnm,setClassName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const studentEmail = localStorage.getItem('email');
                if (!studentEmail) {
                    throw new Error('Student email not found in localStorage');
                }

                // Fetch student details including classId
                const studentResponse = await axios.get(`http://localhost:5000/api/fetchStbyEmail?email=${studentEmail}`);
                const student = studentResponse.data;

                // Fetch class details based on classId
                const classResponse = await axios.get(`http://localhost:5000/api/class/${student.classId}`);
                setStudentClass(classResponse.data);
                setClassName(classResponse.data.className);
                // Fetch subjects based on selected class (student.classId)
                const subjectsResponse = await axios.get(`http://localhost:5000/api/subjects?class=${classResponse.data.className}`);
                setSubjects(subjectsResponse.data);
                
            } catch (err) {
                console.error('Error fetching student class or subjects:', err);
                setError('Failed to fetch student class or subjects');
            }
        };

        fetchStudentData();
    }, []);

    const handleSubjectChange = async (e) => {
        const selectedSubject = e.target.value;
        setSelectedSubject(selectedSubject);
        setSyllabus('');
        setError('');

        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/api/syllabus?className=${classnm}&subject=${selectedSubject}`);
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
            <h1>Student Panel</h1>
            {error && <div className="error-message">{error}</div>}
            {studentClass && (
                <div>
                    <h2>Class: {studentClass.className}</h2>
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
                    {syllabus && (
                        <div className="syllabus-container">
                            <h2>Syllabus</h2>
                            <p>{syllabus}</p>
                        </div>
                    )}
                </div>
            )}
          
        </div>
    );
};

export default StudentPanel;
