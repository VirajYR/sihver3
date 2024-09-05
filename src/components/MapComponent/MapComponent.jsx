import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import dangerZonesData from '../../assets/dangerZonesData';
import { calculateDistance, isWithinTimeFrame } from '../../ContextProvider'; // Adjusted import
import '../styles/MapComponent.css';

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [activeZones, setActiveZones] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isInDangerZone, setIsInDangerZone] = useState(false);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setPosition([latitude, longitude]);
            setMapLoaded(true);
          },
          (error) => {
            console.error("Error getting location:", error);
            setError("Unable to retrieve your location. Please make sure location services are enabled.");
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (mapLoaded && position) {
      const nowActiveZones = dangerZonesData.filter(zone => isWithinTimeFrame(zone));

      const inDangerZone = nowActiveZones.some(zone => {
        const distance = calculateDistance(
          position[0],
          position[1],
          zone.center[0],
          zone.center[1]
        );
        return distance <= zone.radius;
      });

      setIsInDangerZone(inDangerZone);
      setActiveZones(nowActiveZones);
    }
  }, [mapLoaded, position]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!position || !mapLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Display whether the user is in a hotspot */}
      <p style={{ color: isInDangerZone ? 'red' : 'white' }}>
        {isInDangerZone ? 'You are in a hotspot area!' : 'You are not in a hotspot area.'}
      </p>

      {/* Map Rendering */}
      <MapContainer center={position} zoom={13} className="map-container">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* User Location Marker */}
        <Marker position={position}>
          <Popup>
            You are here: <br /> Latitude: {position[0]}, <br /> Longitude: {position[1]}
          </Popup>
        </Marker>

        {/* Render active danger zones */}
        {activeZones.map((zone, index) => (
          <React.Fragment key={index}>
            <Marker position={zone.center}>
              <Popup>
                Danger Zone: <br /> Latitude: {zone.center[0]}, <br /> Longitude: {zone.center[1]}
              </Popup>
            </Marker>
            <Circle
              center={zone.center}
              radius={zone.radius}
              color="red"
              fillColor="red"
              fillOpacity={0.4}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
