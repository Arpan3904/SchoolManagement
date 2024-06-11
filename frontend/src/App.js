import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import PrincipalDashboard from './components/principal/PrincipalDashboard';
import StaffManagement from './components/principal/StaffManagement';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import Attendance from './components/teacher/Attendance';
import Assignment from './components/teacher/Assignment';
import Marks from './components/teacher/Marks';
import StudentDashboard from './components/student/StudentDashboard';
import AssignmentList from './components/student/AssignmentList';
import StudentAttendance from './components/student/Attendance';
import NavigationBar from './components/NavigationBar';
import AddTeacher from './components/principal/AddTeacher';
import AddClass from './components/principal/AddClass';
import ShowClass from './components/principal/ShowClass';
import AddStudent from './components/principal/AddStudent';
import ShowStudent from './components/principal/ShowStudent';
import TakeAttendance from './components/principal/TakeAttendence'
import ShowAttendance from './components/principal/ShowAttendence';
import AddSubject from './components/principal/AddSubject';
import ShowSubject from './components/principal/ShowSubject';
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
import AddMaterial from './components/principal/AddMaterial';
import ShowMaterial from './components/principal/ShowMaterial';


const App = () => {
  const [userRole, setUserRole] = useState('');

  return (
    <Router>
      <>
        <AppContent userRole={userRole} />
      </>
    </Router>
  );
};

const AppContent = ({ userRole }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isSignupPage = location.pathname === '/signup';
  const [dataFromChild, setDataFromChild] = useState(null);
  const handleDataFromChild = (data) => {
    // Receive data from child component and set it in parent state
    setDataFromChild(data);
    console.log(dataFromChild);
    // userRole=dataFromChild;
  };
  return (
    <>
      {!isLoginPage && !isSignupPage && <NavigationBar userRole={dataFromChild} />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login sendDataToParent={handleDataFromChild}/>} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Routes for Principal */}
        {dataFromChild === "principal" && (
          <>
            <Route path="/" element={<PrincipalDashboard />} />
            <Route path="/staff-management" element={<StaffManagement />} />
            <Route path="/add-teacher" element={<AddTeacher/>} />
            <Route path="/add-subject" element={<AddSubject/>} />
            <Route path="/subject-management" element={<ShowSubject/>} />
            <Route path="/class-management" element={<ShowClass/>} />
            <Route path="/add-class" element={<AddClass/>} />
            <Route path="/class/:id/add-student" element={<AddStudent />} />
            <Route path="/class/:id/student-management" element={<ShowStudent />} />
            <Route path="class/:id/take-attendance" element={<TakeAttendance />} />
            <Route path="/showattendence" element={<ShowAttendance />} />
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
            <Route path="/Add_material" element={<AddMaterial />} />


          </>
        )}

        {/* Routes for Teacher */}
        {dataFromChild === "teacher" && (
          <>
            <Route path="/" element={<TeacherDashboard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/assignment" element={<Assignment />} />
            <Route path="/marks" element={<Marks />} />
            <Route path="/" element={<TeacherDashboard />} />
          <Route path="/staff-management" element={<StaffManagement />} />
          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/subject-management" element={<ShowSubject />} />
          <Route path="/class-management" element={<ShowClass />} />
          <Route path="/class/:id/add-student" element={<AddStudent />} />
          <Route path="/class/:id/student-management" element={<ShowStudent />} />
          <Route path="/class/:id/take-attendance" element={<TakeAttendance />} />
          <Route path="/showattendence" element={<ShowAttendance />} />
          <Route path="/timetable-management" element={<ShowTeacherTimetable />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/show-syllabus" element={<ShowSyllabus />} />
          <Route path="/idcard" element={<IDCard />} />
          <Route path="/student-list" element={<StudentList />} />
          <Route path="/notice" element={<AddNotice />} />
          <Route path="/complain" element={<AddComplaint />} />

          
          </>
        )}

        {/* Routes for Student */}
        {dataFromChild === "student" && (
          <>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/assignments" element={<AssignmentList />} />
            <Route path="/attendance" element={<StudentAttendance />} />
            <Route path="/subject-management" element={<ShowSubject/>} />
            <Route path="/timetable-management" element={<ShowTimetable />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/show-syllabus" element={<ShowSyllabus />} />
          <Route path="/idcard" element={<IDCard />} />
          <Route path="/showattendence" element={<ShowAttendance />} />
          <Route path="/student-fee" element={<ShowFees />} />
          <Route path="/notice" element={<AddNotice />} />
          <Route path="/complain" element={<AddComplaint />} />
          </>
        )}

        {/* Wildcard route to handle all other paths */}
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
};

export default App;
