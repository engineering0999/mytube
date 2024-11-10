import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const Test = () => {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  React.useEffect(() => {
    const options = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8',
        type: 'application/x-mpegURL'
      }]
    };

    // Initialize the player
    playerRef.current = videojs(videoRef.current, options, () => {
      console.log('Player is ready');
    });

    // Handle player events
    playerRef.current.on('play', () => {
      console.log('Video is playing');
    });

    playerRef.current.on('pause', () => {
      console.log('Video is paused');
    });

    playerRef.current.on('error', (err) => {
      console.error('Error occurred:', err);
    });

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, []);

  return (
    <div data-vjs-player style={{ width: '100%', height: '100%', border: '2px solid red' }}>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default Test;
