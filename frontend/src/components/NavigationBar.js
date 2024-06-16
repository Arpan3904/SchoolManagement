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
import axios from 'axios';
import '../styles/NavigationBar.css';

const NavigationBar = ({ userRole }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [schoolDetails, setSchoolDetails] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsExpanded(window.innerWidth > 600);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchSchoolDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/school-details');
        setSchoolDetails(response.data);
      } catch (err) {
        console.error('Error fetching school details:', err);
      }
    };

    fetchSchoolDetails();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/show-school-details');
  };

  return (
    <aside className={`navigation-bar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="school-details" onClick={handleLogoClick}>
        {schoolDetails.schoolLogo && (
          <img src={schoolDetails.schoolLogo} alt="School Logo" className="school-logo" />
        )}
        {isExpanded && <p className="school-name">{schoolDetails.schoolName}</p>}
      </div>
      <ul>
        {userRole === 'principal' && (
          <>
            <li>
              <button onClick={() => handleNavigation('/')}>
                <FontAwesomeIcon icon={faUserGraduate} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Principal Dashboard'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/staff-management')}>
                <FontAwesomeIcon icon={faUsers} size="2x" style={{margin:'5px'}} />
                {isExpanded && ' Staff'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/class-management')}>
                <FontAwesomeIcon icon={faUserFriends} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Students'}
              </button>
            </li>
          </>
        )}
        {userRole === 'teacher' && (
          <>
            <li>
              <button onClick={() => handleNavigation('/')}>
                <FontAwesomeIcon icon={faChalkboardTeacher} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Teacher Dashboard'}
              </button> 
            </li>
            <li>
              <button onClick={() => handleNavigation('/attendance')}>
                <FontAwesomeIcon icon={faCalendarCheck} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Attendance'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/homework')}>
                <FontAwesomeIcon icon={faTasks} size="2x" style={{margin:'5px'}} />
                {isExpanded && ' Homework'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/marks')}>
                <FontAwesomeIcon icon={faChartLine} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Marks'}
              </button>
            </li>
          </>
        )}
        {userRole === 'student' && (
          <>
            <li>
              <button onClick={() => handleNavigation('/')}>
                <FontAwesomeIcon icon={faGraduationCap} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Student Dashboard'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/marks')}>
                <FontAwesomeIcon icon={faFileAlt} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' marks'}
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/attendance')}>
                <FontAwesomeIcon icon={faClipboardCheck} size="2x" style={{margin:'5px'}}/>
                {isExpanded && ' Attendance'}
              </button>
            </li>
          </>
        )}
      </ul>
      <div className="logout-button">
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} size="2x" style={{margin:'5px'}} />
          {isExpanded && 'Logout'}
        </button>
      </div>
    </aside>
  );
};

export default NavigationBar;
