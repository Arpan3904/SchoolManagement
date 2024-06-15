import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PrincipalDashboard from './components/principal/PrincipalDashboard';
import StaffManagement from './components/principal/StaffManagement';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import StudentDashboard from './components/student/StudentDashboard';
import AssignmentList from './components/student/AssignmentList';
import ShowTeacherAttendance from './components/teacher/ShowTeacherAttendance';
import NavigationBar from './components/NavigationBar';
import AddTeacher from './components/principal/AddTeacher';
import AddClass from './components/principal/AddClass';
import ShowClass from './components/principal/ShowClass';
import AddStudent from './components/principal/AddStudent';
import ShowStudent from './components/principal/ShowStudent';
import TakeAttendance from './components/principal/TakeAttendence';
import ShowAttendance from './components/principal/ShowAttendence';
import AddSubject from './components/principal/AddSubject';
import ShowSubject from './components/principal/ShowSubject';
import ShowStudentSubject from './components/student/ShowStudentSubject';
import AddTimetable from './components/principal/AddTimetable';
import ShowTimetable from './components/principal/ShowTimetable';
import Gallery from './components/principal/Gallery';
import ShowFees from './components/principal/ShowFees';
import AddFees from './components/principal/AddFees';
import AddSyllabus from './components/principal/AddSyllabus';
import ShowSyllabus from './components/principal/ShowSyllabus';
import IDCard from './components/principal/IdCard';
import StudentList from './components/principal/StudentList';
import AddNotice from './components/principal/AddNotice';
import ShowTeacherTimetable from './components/teacher/ShowTeacherTimetable';
import AddComplaint from './components/teacher/AddComplaint';
import ShowNotices from './components/principal/ShowNotice';
import ShowComplaints from './components/principal/ShowComplaint';
import AddEvent from './components/principal/AddEvent';
import ShowEvents from './components/principal/ShowEvent';
import ShowTeacherEvents from './components/teacher/showTeacherEvents';
import AddMaterial from './components/principal/AddMaterial';
import ShowMaterial from './components/principal/ShowMaterial';
import ShowStudentAttendance from './components/student/ShowStudentAttendance';
import ShowImages from './components/principal/ShowImages';
import AddHomework from './components/principal/AddHomework';
import ShowHomework from './components/principal/showHomework';
import ShowStudentHomework from './components/student/showStudentHomework';
import Video from './components/principal/Video';
import ShowTeacherEvents from './components/teacher/showTeacherEvents';
import ShowGalleryImages from './components/teacher/showGalleryImages';
import ShowVideo from './components/teacher/ShowVideos';
import ShowStudentMaterial from './components/student/ShowStudentMaterial';



const App = () => {
  const [userRole, setUserRole] = useState('');

  return (
    <Router>
      <>
        <AppContent />
      </>
    </Router>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const [dataFromChild, setDataFromChild] = useState(null);

  useEffect(() => {
    // Simulate fetching userRole from localStorage or backend
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      setDataFromChild(storedUserRole);
    }
  }, []);

  if (!dataFromChild && !isLoginPage && !isSignupPage) {
    // Redirect to login if no userRole is set
    return <Navigate to="/login" />;
  }

  const handleDataFromChild = (data) => {
    // Receive data from child component and set it in parent state
    setDataFromChild(data);
  };

  return (
    <>
      {!isLoginPage && !isSignupPage && <NavigationBar userRole={dataFromChild} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login sendDataToParent={handleDataFromChild} />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Routes for Principal */}
        {dataFromChild === "principal" && (
          <>
            <Route path="/" element={<PrincipalDashboard />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/add-teacher" element={<AddTeacher />} />
            <Route path="/add-subject" element={<AddSubject />} />
            <Route path="/subject-management" element={<ShowSubject />} />
            <Route path="/class-management" element={<ShowClass />} />
            <Route path="/add-class" element={<AddClass />} />
            <Route path="/class/:id/add-student" element={<AddStudent />} />
            <Route path="/class/:id/student-management" element={<ShowStudent />} />
            <Route path="/class/:id/take-attendance" element={<TakeAttendance />} />
            <Route path="/showattendance" element={<ShowAttendance />} />
            <Route path="/add-timetable" element={<AddTimetable />} />
            <Route path="/timetable-management" element={<ShowTimetable />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/student-fee" element={<ShowFees />} />
            <Route path="/add-fee" element={<AddFees />} />
            <Route path="/add-syllabus" element={<AddSyllabus />} />
            <Route path="/show-syllabus" element={<ShowSyllabus />} />
            <Route path="/idcard" element={<IDCard />} />
            <Route path="/student-list" element={<StudentList />} />
            <Route path="/notice" element={<ShowNotices />} />
            <Route path="/add_notice" element={<AddNotice />} />
            <Route path="/complain" element={<ShowComplaints />} />
            <Route path="/event" element={<ShowEvents />} />
            <Route path="/add_event" element={<AddEvent />} />
            <Route path="/material" element={<ShowMaterial />} />
            <Route path="/add_material" element={<AddMaterial />} />
            <Route path="/showImages/:eventId" element={<ShowImages />} />
            <Route path="/homework" element={<ShowHomework />} />
            <Route path="/add_homework" element={<AddHomework />} />
            <Route path="/video" element={<Video />} />
          </>
        )}

        {/* Routes for Teacher */}
        {dataFromChild === "teacher" && (
          <>
            <Route path="/" element={<TeacherDashboard />} />
        
           
           
           
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/subject-management" element={<ShowSubject />} />
          <Route path="/class-management" element={<ShowClass />} />
          <Route path="/class/:id/add-student" element={<AddStudent />} />
          <Route path="/class/:id/student-management" element={<ShowStudent />} />
          <Route path="/class/:id/take-attendance" element={<TakeAttendance />} />
          <Route path="/attendance" element={<ShowAttendance />} />
          <Route path="/timetable-management" element={<ShowTeacherTimetable />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/show-syllabus" element={<ShowSyllabus />} />
          <Route path="/idcard" element={<IDCard />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/teacher-attendance" element={<TeacherAttendance />} />
          <Route path="/complain" element={<AddComplaint />} />
          <Route path="/event" element={<ShowTeacherEvents />} />
          <Route path="/notice" element={<ShowNotices />} />
          <Route path="/show-teacher-attendance" element={<ShowTeacherAttendance />} />
          <Route path="/show-teacher-idcard" element={<ShowTeacherIdCard />} />
          <Route path="/homework" element={<ShowHomework />} />
          <Route path="/add_homework" element={<AddHomework />} />
          <Route path="/showImages/:eventId" element={<ShowGalleryImages />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/birthday" element={<ShowStudentBirthday />} />
          <Route path="/video" element={<ShowVideo />} />
          <Route path="/material" element={<ShowMaterial />} />
          <Route path="/add_material" element={<AddMaterial />} />


          
          </>
        )}

        {/* Routes for Student */}
        {dataFromChild === "student" && (
          <>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/subject-management" element={<ShowStudentSubject />} />
            <Route path="/timetable-management" element={<ShowTimetable />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/showImages/:eventId" element={<ShowGalleryImages />} />
          <Route path="/show-syllabus" element={<ShowSyllabus />} />
          <Route path="/idcard" element={<IDCard />} />
          <Route path="/attendance" element={<ShowStudentAttendance />} />
          <Route path="/student-fee" element={<ShowFees />} />
          <Route path="/notice" element={<ShowNotices />} />
          <Route path="/complain" element={<AddComplaint />} />
          <Route path="/event" element={<ShowTeacherEvents />} />
          <Route path="/homework" element={<ShowStudentHomework />} />
          <Route path="/show-student-syllabus" element={<ShowStudentSyllabus />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/birthday" element={<ShowStudentBirthday />} />
          <Route path="/video" element={<ShowVideo />} />
          <Route path="/material" element={<ShowStudentMaterial />} />

          </>
        )}

        {/* Wildcard route to handle all other paths */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
