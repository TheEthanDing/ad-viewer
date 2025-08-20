import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ads');
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append('ads', files[i]);
    }

    try {
      setUploadStatus('Uploading...');
      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        setUploadStatus('Upload successful!');
        fetchAds();
        setTimeout(() => setUploadStatus(''), 3000);
      } else {
        setUploadStatus('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('Upload error');
    }
  };

  const renderAdContent = (ad) => {
    if (ad.type === 'image') {
      return <img src={`http://localhost:3001/ads/${ad.filename}`} alt={ad.name} />;
    } else if (ad.type === 'html') {
      return (
        <iframe
          src={`http://localhost:3001/ads/${ad.filename}`}
          title={ad.name}
          width="100%"
          height="100%"
          frameBorder="0"
        />
      );
    } else if (ad.type === 'react') {
      return (
        <div className="react-preview">
          <p>React Component: {ad.name}</p>
          <a href={`http://localhost:3001/ads/${ad.filename}`} target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </div>
      );
    }
    return <p>Unsupported file type</p>;
  };

  return (
    <div className="App">
      <header className="App-header">
        <span className="terminal-prompt">$</span>
        <span className="terminal-cmd">ad-viewer</span>
        <div className="header-right">
          <input
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.svg,.html,.jsx,.js"
            onChange={handleFileUpload}
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            [upload]
          </label>
          {uploadStatus && <span className="upload-status">{uploadStatus}</span>}
        </div>
      </header>
      
      <div className="content">
        <aside className="sidebar">
          <div className="sidebar-header">FILES</div>
          <div className="ad-list">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className={`ad-item ${selectedAd?.id === ad.id ? 'selected' : ''}`}
                onClick={() => setSelectedAd(ad)}
              >
                <span className="ad-type">{ad.type.substring(0, 3)}</span>
                <span className="ad-name">{ad.name}</span>
              </div>
            ))}
          </div>
        </aside>
        
        <main className="preview-area">
          {selectedAd ? (
            <>
              <div className="preview-header">
                <span className="preview-name">{selectedAd.name}</span>
                <span className="preview-type">[{selectedAd.type}]</span>
              </div>
              {renderAdContent(selectedAd)}
            </>
          ) : (
            <div className="no-selection">
              <span className="cursor">_</span> select file to preview
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;