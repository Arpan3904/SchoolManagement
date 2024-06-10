import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import '../../styles/Gallery.css'; // Import CSS file for styling

const ShowImage = () => {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []); 

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/getImages');
      setImages(response.data.images);
      setLoading(false);
    } catch (error) {
      console.log('Error fetching images:', error);
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', selectedImage);

      await axios.post('http://localhost:5000/api/addImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchImages();

      setLoading(false);
      alert('Image uploaded successfully');
    } catch (error) {
      setLoading(false);
      alert('Failed to upload image');
    }
  };

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="image-gallery-container">
      <h2>Images</h2>
      {loading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="image-grid">
          {images.map((image, index) => (
            <div className="image-frame" key={index} onClick={() => openLightbox(index)}>
              <img className="image" src={`data:image/jpeg;base64,${image.imageData}`} alt={`Image ${index}`} />
            </div>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          mainSrc={`data:image/jpeg;base64,${images[photoIndex].imageData}`}
          nextSrc={`data:image/jpeg;base64,${images[(photoIndex + 1) % images.length].imageData}`}
          prevSrc={`data:image/jpeg;base64,${images[(photoIndex + images.length - 1) % images.length].imageData}`}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
        />
      )}

      <label htmlFor="image-upload" className="circle-container">
        +
        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
      </label>
    </div>
  );
};

export default ShowImage;
