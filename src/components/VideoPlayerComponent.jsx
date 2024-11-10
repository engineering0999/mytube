// src/components/VideoPlayerComponent.jsx
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayerComponent = ({ hlsUrl, isMinimized, onMinimize, onMaximize }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (hlsUrl) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(hlsUrl);
        hlsRef.current.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
      }
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [hlsUrl]);

  return (
    <div className={`fixed ${isMinimized ? 'bottom-0 right-0 w-1/4' : 'w-full lg:w-1/2 h-auto mt-12'}`}>
      <video ref={videoRef} controls className="w-full h-auto" onClick={onMaximize}></video>
      <button onClick={onMinimize} className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded">
        Minimize
      </button>
    </div>
  );
};

export default VideoPlayerComponent;
