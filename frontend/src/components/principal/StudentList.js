import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/StudentList.css';


const ClassAndStudentList = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-class`);
                setClasses(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching classes');
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const fetchStudents = async (classId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-students`, {
                params: { classId }
            });
            setStudents(response.data);
        } catch (err) {
            setError('Error fetching students');
        }
    };

    const handleClassSelect = (classId) => {
        setSelectedClass(classId);
        fetchStudents(classId);
    };

    return (
        <div className="container">
            <h2>Select a Class</h2>
            <div className="select-wrapper">
                <select value={selectedClass} onChange={(e) => handleClassSelect(e.target.value)}>
                    <option value="">Select a class</option>
                    {classes.map(classItem => (
                        <option key={classItem._id} value={classItem._id}>{classItem.className}</option>
                    ))}
                </select>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            {students.length > 0 && (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                <th>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.firstName}</td>
                                    <td>{student.lastName}</td>
                                    <td>{student.contactNo}</td>
                                    <td>{student.email}</td>
                                    <td>{student.password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ClassAndStudentList;
