// src/pages/Playlist.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import formatViews from '../utils/formatViews';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlistData, setPlaylistData] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`https://pipedapi.reallyaweso.me/playlists/${playlistId}`)
      .then(response => {
        setPlaylistData(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the playlist data!", error);
      });
  }, [playlistId]);

  const handlePlayAll = () => {
    setCurrentVideoIndex(0);
  };

  useEffect(() => {
    if (currentVideoIndex !== null && playlistData && playlistData.relatedStreams[currentVideoIndex]) {
      const videoId = playlistData.relatedStreams[currentVideoIndex].url.split('=')[1];
      navigate(`/watch/${videoId}`);
    }
  }, [currentVideoIndex, playlistData, navigate]);

  if (!playlistData) return <div>Loading...</div>;

  const formatDuration = (durationInSeconds) => {
    if (durationInSeconds === -1) {
      return 'Live';
    }
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="p-4 my-14 bg-black text-white">
      {playlistData.relatedStreams.length > 0 && (
        <img src={playlistData.relatedStreams[0].thumbnail} className="w-full h-auto rounded-lg" alt="Playlist Thumbnail"  onClick={() => handlePlayAll()}/>
      )}
      <h1 className="text-2xl font-bold p-2">{playlistData.name}</h1>
      <div className='flex'>
        <img src={playlistData.uploaderAvatar} className='w-10 h-10 rounded-full' />
        <h1 className="text-sm font-bold p-2">{playlistData.uploader}</h1>
      </div>
      <p className="text-gray-500 p-2">Playlist - {playlistData.videos} videos</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {playlistData.relatedStreams.map((video, index) => (
          <div
            key={video.url}
            className="cursor-pointer relative flex"
            onClick={() => setCurrentVideoIndex(index)}
          >

            <img src={video.thumbnail} alt={video.title || video.name} className="w-40 h-24 rounded-md " />
            <div className={`absolute bottom-1 right-56 text-white text-xs p-1  rounded ${video.duration === -1 ? 'bg-red-600' : 'bg-black bg-opacity-70'}`}>
              {formatDuration(video.duration)}
            </div>
            <div className='flex py-2 '>
              <div className='flex flex-col '>
                <h2 className="text-xs px-3 font-bold ">{video.title || video.name}</h2>
                <p className="text-xs text-gray-500 px-3 mt-2">
                  {video.uploaderName} </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
