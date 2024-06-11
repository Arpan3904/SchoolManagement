import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TiTick } from 'react-icons/ti';
import { AiOutlineClose } from 'react-icons/ai';
import '../../styles/Attendance.css';

const StudentAttendance = () => {
    const [student, setStudent] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchStudentAndAttendance = async () => {
            try {
                // Fetch student details
                const studentResponse = await axios.get('http://localhost:5000/api/fetch-student-by-email', {
                    params: { email }
                });
                setStudent(studentResponse.data);

                // Fetch attendance records
                const attendanceResponse = await axios.get('http://localhost:5000/api/fetch-attendance-by-studentId', {
                    params: { studentId: studentResponse.data._id }
                });
                const sortedAttendance = attendanceResponse.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAttendance(sortedAttendance);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchStudentAndAttendance();
    }, [email]);

    if (!student) {
        return (
            <div className="container loading-container">
                <h1>Loading...</h1>
            </div>
        );
    }

    // Function to organize attendance records month-wise
    const organizeAttendanceByMonth = () => {
        const attendanceByMonth = {};
        attendance.forEach(record => {
            const monthYear = `${new Date(record.date).toLocaleString('default', { month: 'long' })} ${new Date(record.date).getFullYear()}`;
            if (!attendanceByMonth[monthYear]) {
                attendanceByMonth[monthYear] = {
                    records: [],
                    presentCount: 0,
                    totalCount: 0
                };
            }
            attendanceByMonth[monthYear].records.push(record);
            attendanceByMonth[monthYear].totalCount++;
            if (record.students.find(s => s.studentId === student._id).present) {
                attendanceByMonth[monthYear].presentCount++;
            }
        });
        return attendanceByMonth;
    };

    const attendanceByMonth = organizeAttendanceByMonth();

    return (
        <motion.div className="container">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <u>{student.firstName} {student.lastName}'s Attendance</u>
            </motion.h1>
            
            {Object.entries(attendanceByMonth).map(([monthYear, data]) => (
                <div key={monthYear} className="attendance-container">
                    <h2>{monthYear} ({data.presentCount}/{data.totalCount})</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.records.map(record => (
                                <tr key={record._id}>
                                    <td>{new Date(record.date).toLocaleDateString()}</td>
                                    <td>{getDayName(new Date(record.date))}</td>
                                    <td>
                                        {record.students.find(s => s.studentId === student._id).present ? (
                                            <TiTick color="#4CAF50" size={36} /> // Green tick for Present
                                        ) : (
                                            <AiOutlineClose color="#F44336" size={36} /> // Red cross for Absent
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </motion.div>
    );
};

// Function to get the day name from a date
const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

export default StudentAttendance;
