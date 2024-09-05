import React from 'react';
import './components/styles/App.css';
import HotspotMenu from './components/HotspotMenuChecker/HotspotMenu.jsx';
import MapComponent from './components/MapComponent/MapComponent.jsx';
import { ContextProvider } from './ContextProvider.jsx';
import DangerZoneList from './components/DangerZoneList/DangerZoneList';


const App = () => {
  const handleFormSubmit = (data) => {
    console.log('Form Submitted:', data);
    // Handle form submission logic here
  };

  const handleFormReset = () => {
    console.log('Form Reset');
    // Handle form reset logic here
  };

  return (
    <ContextProvider>
      <div className="app">
        <header className="app-header">
          <h1>Danger Zone Tracker</h1>
        </header>
        <HotspotMenu onSubmit={handleFormSubmit} onReset={handleFormReset} />
        <div className="flex">
          <div className="danger-zone-list">
            <DangerZoneList />
          </div>
          <div className="map-container">
            <MapComponent />
          </div>

        </div>
      </div>
    </ContextProvider>
  );
};

export default App;
