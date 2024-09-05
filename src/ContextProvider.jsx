import React, { createContext, useContext } from 'react';

const Context = createContext();

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const R = 6371e3; // Earth's radius in meters

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const isWithinTimeFrame = (zone) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0 for January

  const [startHour, startMinutes] = zone.startTime.split(':').map(Number);
  const [endHour, endMinutes] = zone.endTime.split(':').map(Number);

  const isActiveTime = 
    (currentHour > startHour || (currentHour === startHour && currentMinutes >= startMinutes)) &&
    (currentHour < endHour || (currentHour === endHour && currentMinutes <= endMinutes));

  const isActiveMonth = zone.activeMonths.includes(currentMonth);

  return isActiveTime && isActiveMonth;
};


export const ContextProvider = ({ children }) => {
  return (
    <Context.Provider value={{ calculateDistance, isWithinTimeFrame }}>
      {children}
    </Context.Provider>
  );
};

export const useContextData = () => useContext(Context);