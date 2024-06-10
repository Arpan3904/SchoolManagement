import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faAngleLeft, faAngleRight, 
  faUserGraduate, faClipboardList, 
  faCalendarCheck, faSchool, 
  faUsers, faUserFriends, 
  faChalkboardTeacher, faTasks, 
  faChartLine, faGraduationCap, 
  faFileAlt, faClipboardCheck,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons'; // Import necessary icons
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import '../styles/NavigationBar.css'; // Import CSS file for NavigationBar styling

const NavigationBar = ({ userRole }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true); // State to track sidebar expansion

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };
  const handleLogout = () => {
    // Handle logout logic here (e.g., clear local storage, redirect to login)
    navigate('/login'); // Navigate to the login page
  };


  return (
    <aside className={`navigation-bar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="toggle-button" onClick={toggleSidebar}>
        {isExpanded ? <FontAwesomeIcon icon={faAngleLeft} size="2x" /> : <FontAwesomeIcon icon={faAngleRight} size="2x" />}
      </div>
      <ul>
      {userRole === "principal" && (
        <>
          <li>
            <button onClick={() => handleNavigation("/")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faUserGraduate} size="2x" /> Principal Dashboard
                </>
              ) : (
                <FontAwesomeIcon icon={faUserGraduate} size="2x" />
              )}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/staff-management")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faUsers} size="2x" /> Staff
                </>
              ) : (
                <FontAwesomeIcon icon={faUsers} size="2x" />
              )}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/class-management")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faUserFriends} size="2x" /> Students
                </>
              ) : (
                <FontAwesomeIcon icon={faUserFriends} size="2x" />
              )}
            </button>
          </li>
         
        </>
      )}

      {userRole === "teacher" && (
        <>
          <li>
            <button onClick={() => handleNavigation("/")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" /> Teacher Dashboard
                </>
              ) : (
                <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" />
              )}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/attendance")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faCalendarCheck} size="2x" /> Attendance
                </>
              ) : (
                <FontAwesomeIcon icon={faCalendarCheck} size="2x" />
              )}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/assignments")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faTasks} size="2x" /> Assignments
                </>
              ) : (
                <FontAwesomeIcon icon={faTasks} size="2x" />
              )}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/marks")}>
              {isExpanded ? (
                <>
                  <FontAwesomeIcon icon={faChartLine} size="2x" /> Marks
                </>
              ) : (
                <FontAwesomeIcon icon={faChartLine} size="2x" />
              )}
            </button>
          </li>
        </>
      )}

      {userRole === "student" && (
        <>
          <li>
            <button onClick={() => handleNavigation("/")}>
              {isExpanded ? <><FontAwesomeIcon icon={faGraduationCap} size="2x" /> Student Dashboard</> : <FontAwesomeIcon icon={faGraduationCap} size="2x" />}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/assignments")}>
              {isExpanded ? <><FontAwesomeIcon icon={faFileAlt} size="2x" /> Assignments</> : <FontAwesomeIcon icon={faFileAlt} size="2x" />}
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("/attendance")}>
              {isExpanded ? <><FontAwesomeIcon icon={faClipboardCheck} size="2x" /> Attendance</> : <FontAwesomeIcon icon={faClipboardCheck} size="2x" />}
            </button>
          </li>
        </>
      )}
       <div className="logout-button">
  <button onClick={handleLogout}>
    {isExpanded ? <><FontAwesomeIcon icon={faSignOutAlt} size="2x" /> Logout</> : <FontAwesomeIcon icon={faSignOutAlt} size="2x" />}
  </button>
</div>  
      </ul>
    </aside>
  );
};

export default NavigationBar;
