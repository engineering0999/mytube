// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import VideoPlayer from './pages/VideoPlayer';
import Playlist from './pages/Playlist';
import Channel from './pages/Channel';
import Test from './pages/Test';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/test" element={<Test />} />
        <Route path="/watch/:videoId" element={<VideoPlayer />} />
        <Route path="/playlist/:playlistId" element={<Playlist />} />
        <Route path="/channel/:channelId" element={<Channel />} />
      </Routes>
    </Router>
  );
};

export default App;
