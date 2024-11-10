// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home';
// import Search from './pages/Search';
// import VideoPlayer from './pages/VideoPlayer';
// import Playlist from './pages/Playlist';
// import Channel from './pages/Channel';
// import Test from './pages/test';

// const App = () => {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/search" element={<Search />} />
//         <Route path="/test" element={<Test />} />
//         <Route path="/watch/:videoId" element={<VideoPlayer />} />
//         <Route path="/playlist/:playlistId" element={<Playlist />} />
//         <Route path="/channel/:channelId" element={<Channel />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;


// src/App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import VideoPlayer from './pages/VideoPlayer';
import Playlist from './pages/Playlist';
import Channel from './pages/Channel';
import Test from './pages/test';
import Login from './components/Login';
import CryptoJS from 'crypto-js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedHashedCredentials = localStorage.getItem('hashedCredentials');
    const storedUsername = import.meta.env.VITE_USERNAME;
    const storedPassword = import.meta.env.VITE_PASSWORD;

    const verifyCredentials = () => {
      if (storedHashedCredentials) {
        const hashedCredentials = CryptoJS.SHA256(`${storedUsername}:${storedPassword}`).toString();
        if (storedHashedCredentials === hashedCredentials) {
          setIsAuthenticated(true);
        }
      }
    };

    verifyCredentials();
  }, []);

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/test" element={<Test />} />
            <Route path="/watch/:videoId" element={<VideoPlayer />} />
            <Route path="/playlist/:playlistId" element={<Playlist />} />
            <Route path="/channel/:channelId" element={<Channel />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Login />
      )}
    </Router>
  );
};

export default App;
