import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/AddMaterial.css';

const AddMaterial = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [materialLink, setMaterialLink] = useState('');
  const [error, setError] = useState('');
  const [useDriveLink, setUseDriveLink] = useState(false);
  const [isPickerApiLoaded, setPickerApiLoaded] = useState(false);
  const [oauthToken, setOauthToken] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classes');
        setClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('An error occurred while fetching classes.');
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    // Load the Google API libraries
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('auth', { callback: onAuthApiLoad });
      window.gapi.load('picker', { callback: onPickerApiLoad });
    };
    document.body.appendChild(script);
  }, []);

  const onAuthApiLoad = () => {
    // Set up auth instance
    window.gapi.auth.authorize(
      {
        client_id: '1075301321912-or3uqq8l7rvnd86mn940hkoogr4bq57t.apps.googleusercontent.com',
        scope: ['https://www.googleapis.com/auth/drive.file'],
        immediate: false,
      },
      handleAuthResult
    );
  };

  const onPickerApiLoad = () => {
    setPickerApiLoaded(true);
  };

  const handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      setOauthToken(authResult.access_token);
      createPicker(authResult.access_token);
    } else {
      console.error('Authentication error:', authResult.error);
      setError('Failed to authenticate with Google Drive.');
    }
  };

  const createPicker = (oauthToken) => {
    if (isPickerApiLoaded && oauthToken) {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(oauthToken)
        .setDeveloperKey('AIzaSyALVM73q7e3p5GJHBzHi55eQRY-mnOvk-Y')
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  };

  const pickerCallback = (data) => {
    if (data.action === window.google.picker.Action.PICKED) {
      const fileId = data.docs[0].id;
      const driveLink = `https://drive.google.com/file/d/${fileId}/view?usp=sharing`;
      setMaterialLink(driveLink);
    } else if (data.action === window.google.picker.Action.CANCEL) {
      console.log('User cancelled picking files.');
    } else {
      console.error('Error picking files:', data);
      setError('An error occurred while picking the file.');
    }
  };

  const handleGoogleDriveUpload = () => {
    if (!oauthToken) {
      window.gapi.auth.authorize(
        {
          client_id: '1075301321912-or3uqq8l7rvnd86mn940hkoogr4bq57t.apps.googleusercontent.com',
          scope: ['https://www.googleapis.com/auth/drive.file'],
          immediate: false,
        },
        handleAuthResult
      );
    } else {
      createPicker(oauthToken);
    }
  };

  const handleClassChange = async (e) => {
    const selectedClass = e.target.value;
    setSelectedClass(selectedClass);

    try {
      const response = await axios.get(`http://localhost:5000/api/subjects?class=${selectedClass}`);
      setSubjects(response.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setError('An error occurred while fetching subjects.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/saveMaterials', {
        className: selectedClass,
        subject: selectedSubject,
        materialLink,
      });

      setSelectedClass('');
      setSelectedSubject('');
      setMaterialLink('');
      setUseDriveLink(false);
    } catch (err) {
      console.error('Error adding material:', err);
      setError('An error occurred while adding the material.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add Material</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Select Class:</label>
          <select value={selectedClass} onChange={handleClassChange} required>
            <option value="">Select Class</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.className}>{classItem.className}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Subject:</label>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} required>
            <option value="">Select Subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject.subjectName}>{subject.subjectName}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Material Link:</label>
          {!useDriveLink && (
            <input
              type="text"
              value={materialLink}
              onChange={(e) => setMaterialLink(e.target.value)}
              required
            />
          )}
          {useDriveLink && (
            <button
              type="button"
              onClick={handleGoogleDriveUpload}
              style={{
                padding: '0.75rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'background-color 0.3s ease',
                marginTop: '10px',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
            >
              Select from Google Drive
            </button>
          )}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={useDriveLink}
              onChange={(e) => setUseDriveLink(e.target.checked)}
            />
            Use Google Drive Link
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
            marginTop: '20px',
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
        >
          Add Material
        </button>
      </form>
    </div>
  );
};

export default AddMaterial;
