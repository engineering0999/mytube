// src/context/PersistentPlayerContext.jsx
import React, { createContext, useState, useContext } from 'react';

const PersistentPlayerContext = createContext();

export const PersistentPlayerProvider = ({ children }) => {
  const [videoData, setVideoData] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const playVideo = (data) => {
    setVideoData(data);
    setIsMinimized(false);
  };

  const minimizePlayer = () => {
    setIsMinimized(true);
  };

  const maximizePlayer = () => {
    setIsMinimized(false);
  };

  return (
    <PersistentPlayerContext.Provider value={{ videoData, isMinimized, playVideo, minimizePlayer, maximizePlayer }}>
      {children}
    </PersistentPlayerContext.Provider>
  );
};

export const usePersistentPlayer = () => useContext(PersistentPlayerContext);
