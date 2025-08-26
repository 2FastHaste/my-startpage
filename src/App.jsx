import React from 'react';
import './index.css';
import Clock from './components/Clock';
import Calendar from './components/Calendar';
import Weather from './components/Weather';
import SocialLinks from './components/SocialLinks';
import MusicLinks from './components/MusicLinks'; // Add this import

function App() {
  return (
    <>
      <div className="grid-wrapper">
        <div className="top-row-grid">
          <Clock />
          <Weather />
        </div>
        <div className="bottom-row-grid">
          <Calendar />
          <SocialLinks />
          <MusicLinks />
        </div>
      </div>
    </>
  );
}

export default App;