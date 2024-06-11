import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../styles/Attendance.css';

const TakeAttendance = () => {
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fetch-class');
                setClasses(response.data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };
        fetchClasses();
    }, []);

    const handleClassChange = async (e) => {
        const classId = e.target.value;
        setSelectedClass(classId);
        await fetchStudentsAndAttendance(classId, date);
    };

    const handleDateChange = async (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        if (selectedClass) {
            await fetchStudentsAndAttendance(selectedClass, newDate);
        }
    };

    const fetchStudentsAndAttendance = async (classId, date) => {
        try {
            const [studentsResponse, attendanceResponse] = await Promise.all([
                axios.get(`http://localhost:5000/api/fetch-students?classId=${classId}`),
                axios.get(`http://localhost:5000/api/fetch-attendance?classId=${classId}&date=${date}`)
            ]);

            setStudents(studentsResponse.data);

            if (attendanceResponse.data) {
                const fetchedAttendance = attendanceResponse.data.students.reduce((acc, student) => {
                    acc[student.studentId] = student.present;
                    return acc;
                }, {});
                setAttendance(fetchedAttendance);
            } else {
                const initialAttendance = studentsResponse.data.reduce((acc, student) => {
                    acc[student._id] = false; // default all students to absent
                    return acc;
                }, {});
                setAttendance(initialAttendance);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAttendanceChange = (studentId) => {
        setAttendance({
            ...attendance,
            [studentId]: !attendance[studentId]
        });
    };

    const handleSubmit = async () => {
        try {
            const studentsAttendance = Object.keys(attendance).map(studentId => ({
                studentId,
                present: attendance[studentId]
            }));
            await axios.post('http://localhost:5000/api/save-attendance', {
                classId: selectedClass,
                date,
                students: studentsAttendance
            });
            alert('Attendance saved successfully');
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance');
        }
    };

    return (
        <div className="container">
            <h1>Take Attendance</h1>
            <div className="form-group">
                <label>Select Class:</label>
                <select onChange={handleClassChange} value={selectedClass}>
                    <option value="" disabled>Select a class</option>
                    {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.className}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label>Select Date:</label>
                <input type="date" value={date} onChange={handleDateChange} />
            </div>
            <div className="students-container">
                <h2>Students</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Present</th>
                        </tr>
                    </thead>
                    <TransitionGroup component="tbody">
                        {students.map(student => (
                            <CSSTransition key={student._id} timeout={500} classNames="fade">
                                <tr>
                                    <td>{student.firstName} {student.lastName}</td>
                                    <td>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={attendance[student._id] || false}
                                                onChange={() => handleAttendanceChange(student._id)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                </tr>
                            </CSSTransition>
                        ))}
                    </TransitionGroup>
                </table>
            </div>
            <button onClick={handleSubmit} className="submit-btn">Save Attendance</button>
        </div>
    );
};

export default TakeAttendance;
