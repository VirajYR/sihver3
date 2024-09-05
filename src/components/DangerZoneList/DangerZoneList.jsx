import React, { useEffect, useState } from 'react';
import { useContextData } from '../../ContextProvider';
import dangerZonesData from '../../assets/dangerZonesData';
import "../styles/DangerList.css"

const DangerZoneList = () => {
  const { isWithinTimeFrame } = useContextData();
  const [activeZones, setActiveZones] = useState([]);

  useEffect(() => {
    if (!isWithinTimeFrame) {
      console.error('isWithinTimeFrame function is not available in context.');
      return;
    }

    // Filter danger zones based on the current time frame
    const nowActiveZones = dangerZonesData.filter(zone => isWithinTimeFrame(zone));
    console.log("Active danger zones:", nowActiveZones);  // Debug log
    setActiveZones(nowActiveZones);
  }, [isWithinTimeFrame]);

  return (
    <div className='DangerList'>
      <h2>Active Danger Zones</h2>
      <ul>
        {activeZones.length > 0 ? (
          activeZones.map((zone) => (
            <li key={zone.id}>
              {zone.zoneName} 
            </li>
          ))
        ) : (
          <li>No active danger zones at the moment.</li>
        )}
      </ul>
    </div>
  );
};

export default DangerZoneList;
