import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../../styles/Attendance.css';

const TakeTeacherAttendance = () => {
    const [teachers, setTeachers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [holidayMessage, setHolidayMessage] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/fetch-teachers');
                setTeachers(response.data);
                // Fetch attendance for the initial date
                await fetchTeacherAttendance(date);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };
        fetchTeachers();
    }, [date]);

    const handleDateChange = async (e) => {
        const newDate = e.target.value;
        setDate(newDate);
        await fetchTeacherAttendance(newDate);
    };

    const isPastDate = (selectedDate) => {
        const today = new Date();
        const dateToCheck = new Date(selectedDate);
        return dateToCheck < today.setHours(0, 0, 0, 0);
    };

    const fetchTeacherAttendance = async (date) => {
        try {
            const attendanceResponse = await axios.get(`http://localhost:5000/api/fetch-teacher-attendance?date=${date}`);

            if (attendanceResponse.data.length) {
                const fetchedAttendance = attendanceResponse.data.reduce((acc, record) => {
                    acc[record.teacherId] = record.present;
                    return acc;
                }, {});
                setAttendance(fetchedAttendance);
                setHolidayMessage('');
            } else {
                const initialAttendance = teachers.reduce((acc, teacher) => {
                    acc[teacher._id] = false;
                    return acc;
                }, {});
                setAttendance(initialAttendance);

                const dayOfWeek = new Date(date).getDay();
                if (isPastDate(date)) {
                    if (dayOfWeek === 0) {
                        setHolidayMessage("It was Sunday! Enjoy your day off! 🌞");
                    } else {
                        setHolidayMessage("It was a holiday! Take a break and have fun! 🎉");
                    }
                } else {
                    setHolidayMessage('');
                }
            }
        } catch (error) {
            console.error('Error fetching teacher attendance:', error);
        }
    };

    const handleAttendanceChange = (teacherId) => {
        setAttendance({
            ...attendance,
            [teacherId]: !attendance[teacherId]
        });
    };

    const handleSubmit = async () => {
        try {
            const teachersAttendance = Object.keys(attendance).map(teacherId => ({
                teacherId,
                present: attendance[teacherId]
            }));
            await axios.post('http://localhost:5000/api/save-teacher-attendance', {
                date,
                teachers: teachersAttendance
            });
            alert('Attendance saved successfully');
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance');
        }
    };

    return (
        <div className="container">
            <h1>Take Teacher Attendance</h1>
            <div className="form-group">
                <label>Select Date:</label>
                <input type="date" value={date} onChange={handleDateChange} />
            </div>
            <CSSTransition
                in={teachers.length > 0}
                timeout={300}
                classNames="fade"
                unmountOnExit
            >
                <div className="teachers-container">
                    <h2>Teachers</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Present</th>
                            </tr>
                        </thead>
                        <TransitionGroup component="tbody">
                            {teachers.map(teacher => (
                                <CSSTransition key={teacher._id} timeout={500} classNames="fade">
                                    <tr>
                                        <td>{teacher.firstName} {teacher.lastName}</td>
                                        <td>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={attendance[teacher._id] || false}
                                                    onChange={() => handleAttendanceChange(teacher._id)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </td>
                                    </tr>
                                </CSSTransition>
                            ))}
                        </TransitionGroup>
                    </table>
                </div>
            </CSSTransition>
            {holidayMessage && (
                <CSSTransition
                    in={!!holidayMessage}
                    timeout={300}
                    classNames="fade"
                    unmountOnExit
                >
                    <div className="holiday-message">
                        <p>{holidayMessage}</p>
                    </div>
                </CSSTransition>
            )}
            <button onClick={handleSubmit} className="submit-btn">Save Attendance</button>
        </div>
    );
};

export default TakeTeacherAttendance;
