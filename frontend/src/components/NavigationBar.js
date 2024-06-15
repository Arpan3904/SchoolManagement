import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faUsers,
  faUserFriends,
  faChalkboardTeacher,
  faCalendarCheck,
  faTasks,
  faChartLine,
  faGraduationCap,
  faFileAlt,
  faClipboardCheck,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/NavigationBar.css';

const NavigationBar = ({ userRole }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  // Effect to handle automatic collapse based on screen width
  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 600); // Expand if screen width is greater than 600px
    };

    // Initial check on component mount
    handleResize();

    // Event listener for window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <aside className={`navigation-bar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <ul>
        {userRole === 'principal' && (
          <>
            <li>
              <button onClick={() => handleNavigation('/')}>
                <FontAwesomeIcon icon={faUserGraduate} size="2x" />
                {isExpanded && 'Principal Dashboard'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/staff-management')}>
                <FontAwesomeIcon icon={faUsers} size="2x" />
                {isExpanded && 'Staff'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/class-management')}>
                <FontAwesomeIcon icon={faUserFriends} size="2x" />
                {isExpanded && 'Students'}
              </button>
            </li>
          </>
        )}

        {userRole === 'teacher' && (
          <>
            <li>
              <button onClick={() => handleNavigation('/')}>
                <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" />
                {isExpanded && 'Teacher Dashboard'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/attendance')}>
                <FontAwesomeIcon icon={faCalendarCheck} size="2x" />
                {isExpanded && 'Attendance'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/homework')}>
                <FontAwesomeIcon icon={faTasks} size="2x" />
                {isExpanded && 'Homework'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/marks')}>
                <FontAwesomeIcon icon={faChartLine} size="2x" />
                {isExpanded && 'Marks'}
              </button>
            </li>
          </>
        )}

        {userRole === 'student' && (
          <>
            <li>
              <button onClick={() => handleNavigation('/')}>
                <FontAwesomeIcon icon={faGraduationCap} size="2x" />
                {isExpanded && 'Student Dashboard'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/marks')}>
                <FontAwesomeIcon icon={faFileAlt} size="2x" />
                {isExpanded && 'marks'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/attendance')}>
                <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
                {isExpanded && 'Attendance'}
              </button>
            </li>
          </>
        )}
      </ul>
      <div className="logout-button">
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
          {isExpanded && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default NavigationBar;
