import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Video.css';

const ShowVideo = () => {
  const [videos, setVideos] = useState([]);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/videos`);
      setVideos(response.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const addVideo = async () => {
    try {
      const embedUrl = newVideoUrl.replace('watch?v=', 'embed/');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/videos`, { url: embedUrl, title: newVideoTitle });
      setVideos([...videos, response.data]);
      setNewVideoUrl('');
      setNewVideoTitle('');
      setShowAddVideoModal(false); // Close modal after adding video
    } catch (err) {
      console.error('Error adding video:', err);
    }
  };

  const removeVideo = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/videos/${id}`);
      setVideos(videos.filter(video => video._id !== id));
    } catch (err) {
      console.error('Error removing video:', err);
    }
  };

  const openAddVideoModal = () => {
    setShowAddVideoModal(true);
  };

  const closeAddVideoModal = () => {
    setShowAddVideoModal(false);
  };

  return (
    <div className="video-container">
      <h2>School Videos</h2>
      <div className="video-list">
        {videos.map(video => (
          <div key={video._id} className="video-item">
            <iframe 
              src={video.url} 
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              onError={(e) => { e.target.style.display = 'none'; alert("Video cannot be embedded"); }}
            ></iframe>
            
          </div>
        ))}
      </div>
      
      
    </div>
  );
};

export default ShowVideo;
