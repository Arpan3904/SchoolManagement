import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/Schedule.css';

const ShowSchedule = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [scheduleRows, setScheduleRows] = useState([]);
    const [examTypes, setExamTypes] = useState([]);
    const [studentClass, setStudentClass] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        if (userRole === 'student') {
            fetchStudentClassDetails(userEmail);
        } else {
            axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-class`).then(response => setClasses(response.data));
        }
    }, [userRole, userEmail]);

    useEffect(() => {
        if (selectedClass) {
            fetchSchedule(selectedClass);
        }
    }, [selectedClass]);

    const fetchStudentClassDetails = async (email) => {
        try {
            const studentResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/fetchStbyEmail?email=${email}`);
            const student = studentResponse.data;
            const classResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/class/${student.classId}`);
            setStudentClass(classResponse.data.className);
            setSelectedClass(classResponse.data.className); // Automatically set selected class
        } catch (err) {
            console.error('Error fetching student or class data:', err);
            setError('An error occurred while fetching student class details.');
        }
    };

    const fetchSchedule = (className) => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-schedule?class=${encodeURIComponent(className)}`)
            .then(response => {
                const currentDateTime = new Date();

                const filteredSchedule = response.data.filter(row => {
                    const examDate = new Date(row.date);

                    const examYear = examDate.getFullYear();
                    const examMonth = examDate.getMonth();
                    const examDay = examDate.getDate();

                    const currentYear = currentDateTime.getFullYear();
                    const currentMonth = currentDateTime.getMonth();
                    const currentDay = currentDateTime.getDate();

                    if (examYear > currentYear) {
                        return true;
                    } else if (examYear === currentYear && examMonth > currentMonth) {
                        return true;
                    } else if (examYear === currentYear && examMonth === currentMonth && examDay >= currentDay) {
                        return true;
                    } else {
                        return false;
                    }
                });

                filteredSchedule.sort((a, b) => new Date(a.date) - new Date(b.date));

                setScheduleRows(filteredSchedule);
            })
            .catch(error => {
                console.error('Error fetching schedule:', error);
                setScheduleRows([]);
            });

        axios.get(`${process.env.REACT_APP_API_URL}/api/fetch-exam-types`)
            .then(response => setExamTypes(response.data))
            .catch(error => console.error('Error fetching exam types:', error));
    };

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
    };

    const handleAddSchedule = () => {
        navigate('/add-exam-schedule');
    };

    return (
        <div className="show-schedule-container">
            <h2>Exam Schedule</h2>
            {userRole !== 'student' ? (
                <div>
                    <label>Select Class: </label>
                    <select value={selectedClass} onChange={handleClassChange}>
                        <option value="">Select Class</option>
                        {classes.map((classItem) => (
                            <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <div>
                    <label>Class: </label>
                    <span>{studentClass}</span>
                </div>
            )}
            {scheduleRows.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Subject</th>
                            <th>Exam Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleRows.map((row, index) => (
                            <tr key={index}>
                                <td>{new Date(row.date).toLocaleDateString('en-GB')}</td>
                                <td>{row.from}</td>
                                <td>{row.to}</td>
                                <td>{row.subject}</td>
                                <td>{row.frequency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No upcoming exams found for the selected class.</p>
            )}
            {userRole === 'principal' && (
                <button onClick={handleAddSchedule} className='button-st'>Add Schedule</button>
            )}
        </div>
    );
};

export default ShowSchedule;
