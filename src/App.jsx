import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/ads.json');
      const data = await response.json();
      setAds(data);
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };


  const renderAdContent = (ad) => {
    if (ad.type === 'image') {
      return <img src={`/ads/${ad.filename}`} alt={ad.name} />;
    } else if (ad.type === 'html') {
      return (
        <iframe
          src={`/ads/${ad.filename}`}
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
          <a href={`/ads/${ad.filename}`} target="_blank" rel="noopener noreferrer">
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
          <span className="info-text">[static hosting]</span>
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