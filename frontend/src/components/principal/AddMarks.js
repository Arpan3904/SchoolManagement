import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../../styles/Schedule.css';

const ShowPreviousExams = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [previousExams, setPreviousExams] = useState([]);
    const [selectedExam, setSelectedExam] = useState(null);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [showAddMarks, setShowAddMarks] = useState(false);
    const [showMarksForExam, setShowMarksForExam] = useState(null);
    const [examTotalMarks, setExamTotalMarks] = useState(0);
    const [showDateForExam, setShowDateForExam] = useState(null);

    const addMarksRef = useRef(null);

    useEffect(() => {
        // Fetch classes on component mount
        axios.get('http://localhost:5000/api/fetch-class')
            .then(response => setClasses(response.data))
            .catch(error => console.error('Error fetching classes:', error));
    }, []);

    const handleClassChange = (e) => {
        const className = e.target.value;
        setSelectedClass(className);

        // Fetch schedules for selected class
        axios.get(`http://localhost:5000/api/fetch-schedule?class=${encodeURIComponent(className)}`)
            .then(response => {
                const currentDate = new Date();
                const previousExams = response.data.filter(row => new Date(row.date) < currentDate);
                setPreviousExams(previousExams);
            })
            .catch(error => {
                console.error('Error fetching previous exams:', error);
                setPreviousExams([]);
            });
    };

    const handleAddMarks = (exam) => {
        setSelectedExam(exam);
        setShowAddMarks(true);

        // Fetch class details by name
        axios.get(`http://localhost:5000/api/fetch-class-by-name?className=${encodeURIComponent(exam.class)}`)
            .then(response => {
                const classId = response.data._id;

                // Fetch students for the selected class
                axios.get(`http://localhost:5000/api/fetch-students?classId=${encodeURIComponent(classId)}`)
                    .then(response => {
                        const studentsData = response.data.map(student => ({
                            ...student,
                            fullName: `${student.firstName} ${student.middleName} ${student.lastName}`
                        }));
                        setStudents(studentsData);
                    })
                    .catch(error => console.error('Error fetching students:', error));
            })
            .catch(error => console.error('Error fetching class ID:', error));
    };

    const handleMarksChange = (studentEmail, value) => {
        setMarks(prevMarks => ({
            ...prevMarks,
            [studentEmail]: value
        }));
    };

    const handleAbsent = (studentEmail) => {
        setMarks(prevMarks => ({
            ...prevMarks,
            [studentEmail]: 'absent'
        }));
    };

    const handleSave = () => {
        const studentResults = students.map(student => ({
            studentEmail: student.email,
            fullName: student.fullName,
            marks: marks[student.email] === 'absent' ? '0' : marks[student.email],
            absent: marks[student.email] === 'absent'
        }));

        const totalMarksNumber = parseInt(totalMarks);
        const marksExceedTotal = studentResults.some(result => {
            if (!result.absent && parseInt(result.marks) > totalMarksNumber) {
                return true;
            }
            return false;
        });

        if (marksExceedTotal) {
            alert('Error: Some students have marks greater than the total marks entered.');
            return;
        }

        const payload = {
            examScheduleId: selectedExam._id,
            examDate: selectedExam.date,
            totalMarks: totalMarksNumber,
            studentResults
        };

        // Save exam results
        axios.post('http://localhost:5000/api/save-exam-results', payload)
            .then(response => {
                alert('Exam results saved successfully');
                setSelectedExam(null);
                setMarks({});
                setTotalMarks(0);
                setShowAddMarks(false);
            })
            .catch(error => {
                console.error('Error saving exam results:', error);
                alert('Failed to save exam results');
            });
    };

    const handleShowMarks = (exam) => {
        setSelectedExam(exam);

        // Fetch exam results for the selected exam
        axios.get(`http://localhost:5000/api/fetch-exam-results?examScheduleId=${encodeURIComponent(exam._id)}`)
            .then(response => {
                const existingResults = response.data;
                let marksData = [];

                // Filter marksData based on userRole and email
                const userRole = localStorage.getItem('userRole');
                const userEmail = localStorage.getItem('email');

                if (userRole === 'student') {
                    // Only show marks for the logged-in student
                    marksData = existingResults.flatMap(result => {
                        return result.studentResults
                            .filter(studentResult => studentResult.studentEmail === userEmail)
                            .map(studentResult => ({
                                fullName: studentResult.fullName,
                                email: studentResult.studentEmail,
                                marks: studentResult.absent ? 'Absent' : studentResult.marks.toString()
                            }));
                    });
                } else {
                    // Show marks for all students
                    marksData = existingResults.flatMap(result => {
                        return result.studentResults.map(studentResult => ({
                            fullName: studentResult.fullName,
                            email: studentResult.studentEmail,
                            marks: studentResult.absent ? 'Absent' : studentResult.marks.toString()
                        }));
                    });
                }

                setMarks(marksData);
                setExamTotalMarks(existingResults[0].totalMarks);
                setShowDateForExam(existingResults[0].examDate);
                setShowMarksForExam(true); // Set to true to display the marks container

                // Scroll to the show marks section
                setTimeout(() => {
                    if (addMarksRef.current) {
                        addMarksRef.current.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            })
            .catch(error => console.error('Error fetching exam results:', error));
    };

    return (
        <div className="show-previous-exams-container">
            <h2>Show Previous Exams</h2>
            <div>
                <label>Select Class: </label>
                <select value={selectedClass} onChange={handleClassChange}>
                    <option value="">Select Class</option>
                    {classes.map((classItem) => (
                        <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
                    ))}
                </select>
            </div>
            {previousExams.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Class</th>
                            <th>Date</th>
                            <th>Subject</th>
                            {localStorage.getItem('userRole') !== 'student' && <th>Add Marks</th>}
                            <th>Show Marks</th> {/* New column for show marks button */}
                        </tr>
                    </thead>
                    <tbody>
                        {previousExams.map((exam, index) => (
                            <tr key={index}>
                                <td>{exam.class}</td>
                                <td>{new Date(exam.date).toLocaleDateString('en-GB')}</td>
                                <td>{exam.subject}</td>
                                {localStorage.getItem('userRole') !== 'student' && (
                                    <td>
                                        <button onClick={() => handleAddMarks(exam)}>Add Marks</button>
                                    </td>
                                )}
                                <td>
                                    <button onClick={() => handleShowMarks(exam)}>Show Marks</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No previous exams found for the selected class.</p>
            )}

            {showAddMarks && (
                <div ref={addMarksRef} className="add-marks-container">
                    <h3>Add Marks for {selectedExam.subject} on {new Date(selectedExam.date).toLocaleDateString('en-GB')}</h3>
                    <label>Total Marks: </label>
                    <input
                        type="number"
                        value={totalMarks}
                        onChange={(e) => setTotalMarks(e.target.value)}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Marks</th>
                                <th>Absent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.email}>
                                    <td>{student.fullName}</td>
                                    <td>{student.email}</td>
                                    <td>
                                        <input
                                            type="number"                                             value={marks[student.email] !== 'absent' ? marks[student.email] : ''}
                                            onChange={(e) => handleMarksChange(student.email, e.target.value)}
                                            disabled={marks[student.email] === 'absent'}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleAbsent(student.email)}>Absent</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleSave} className='button-st'>Save</button>
                </div>
            )}

            {showMarksForExam && (
                <div className="show-marks-container">
                  
                    {marks.length > 0 ? (
                        <div>
                            <p>Total Marks: {examTotalMarks}</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Email</th>
                                        <th>Marks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {marks.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.fullName}</td>
                                            <td>{student.email}</td>
                                            <td>{student.marks}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No results available.</p>
                    )}
                    <button onClick={() => setShowMarksForExam(false)} className='button-st'>Close</button>
                </div>
            )}
        </div>
    );
};

export default ShowPreviousExams;

