import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TiTick } from 'react-icons/ti';
import { AiOutlineClose } from 'react-icons/ai';
import '../../styles/Attendance.css';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
};

const StudentAttendance = () => {
    const [student, setStudent] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const email = localStorage.getItem('email');

    useEffect(() => {
        const fetchStudentAndAttendance = async () => {
            try {
                const studentResponse = await axios.get('http://localhost:5000/api/fetch-student-by-email', {
                    params: { email }
                });
                setStudent(studentResponse.data);

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

    const getAttendanceForDate = (date) => {
        const record = attendance.find(record => new Date(record.date).toDateString() === date.toDateString());
        return record ? record.students.find(s => s.studentId === student._id).present : null;
    };

    const generateCalendar = () => {
        const startDate = new Date(selectedYear, selectedMonth, 1);
        const endDate = new Date(selectedYear, selectedMonth + 1, 0);
        const daysInMonth = endDate.getDate();
        const startDay = startDate.getDay();

        const calendar = [];
        let week = [];
        for (let i = 0; i < startDay; i++) {
            week.push(<td key={`empty-${i}`} className="empty"></td>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(selectedYear, selectedMonth, day);
            const isPresent = getAttendanceForDate(date);
            week.push(
                <motion.td 
                    key={day} 
                    className={isPresent !== null ? (isPresent ? 'present' : 'absent') : ''}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.1 }}
                >
                    {day}
                    {isPresent !== null && (
                        <span className={`icon ${isPresent ? 'tick' : 'cross'}`}>
                            {isPresent ? <TiTick /> : <AiOutlineClose />}
                        </span>
                    )}
                </motion.td>
            );
            if (week.length === 7 || day === daysInMonth) {
                calendar.push(<tr key={day}>{week}</tr>);
                week = [];
            }
        }
        return calendar;
    };

    const calculateAttendanceCounts = () => {
        const filteredAttendance = attendance.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === selectedMonth && recordDate.getFullYear() === selectedYear;
        });

        const totalAttendance = filteredAttendance.length;
        const presentCount = filteredAttendance.filter(record => record.students.find(s => s.studentId === student._id).present).length;
        const absentCount = totalAttendance - presentCount;

        return { totalAttendance, presentCount, absentCount };
    };

    if (!student) {
        return (
            <div className="container loading-container">
                <h1>Loading...</h1>
            </div>
        );
    }

    const { totalAttendance, presentCount, absentCount } = calculateAttendanceCounts();

    return (
        <motion.div className="att-container">
            <motion.h1
                className="title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {student.firstName} {student.lastName}'s Attendance
            </motion.h1>

            <div className="dropdowns">
                <label className="dropdown-label" htmlFor="month-select">Month:</label>
                <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
                <label className="dropdown-label" htmlFor="year-select">Year:</label>
                <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                    {Array.from(new Array(20), (val, index) => new Date().getFullYear() - index).map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            <table className="calendar">
                <thead>
                    <tr>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {generateCalendar()}
                </tbody>
            </table>

            <div className="attendance-summary">
                <p className="total">Total Attendance: {totalAttendance}</p>
                <p className="present">Present: {presentCount}</p>
                <p className="absent">Absent: {absentCount}</p>
            </div>
        </motion.div>
    );
};

export default StudentAttendance;
