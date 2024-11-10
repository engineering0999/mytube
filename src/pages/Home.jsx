// src/pages/Home.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formatViews from '../utils/formatViews';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://pipedapi.reallyaweso.me/search?q=telugulatest&filter=all')
      .then(response => {
        setVideos(response.data.items);
        setNextPage(response.data.nextpage);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  const handlePlaylistClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId.split('/')[2]}`);
  };

  const handleLoadMore = () => {
    if (nextPage) {
      axios.get(`https://pipedapi.reallyaweso.me/nextpage/search?nextpage=${encodeURIComponent(nextPage)}&q=telugu&filter=all`)
        .then(response => {
          setVideos([...videos, ...response.data.items]);
          setNextPage(response.data.nextpage);
        });
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        handleLoadMore();
      }
    }, options);

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [videos, nextPage]);

  const formatDuration = (durationInSeconds) => {
    if (durationInSeconds === -1) {
      return 'Live';
    }
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-14 bg-black text-white">
      {videos.map((item, index) => (
        <div
          key={item.url}
          className="cursor-pointer relative"
          onClick={() => item.type === 'stream' ? handleVideoClick(item.url.split('=')[1]) : handlePlaylistClick(item.url.split('=')[1])}
          ref={index === videos.length - 1 ? observerRef : null}
        >
          <img src={item.thumbnail} alt={item.title || item.name} className="w-full " />
          <div className={`absolute bottom-28 right-2 text-white text-xs px-2 py-1 rounded ${item.duration === -1 ? 'bg-red-600' : 'bg-black bg-opacity-70'}`}>
            {formatDuration(item.duration)}
          </div>
          <div className='flex py-4 px-2'>
            <img src={item.uploaderAvatar} className='w-10 h-10 rounded-full' onClick={(e) => { e.stopPropagation(); handleChannelClick(item.uploaderUrl); }}/>
            <div className='flex flex-col '>
              <h2 className="text-sm px-3 ">{item.title || item.name}</h2>
              <p className="text-xs text-gray-500 px-3 mt-2" onClick={(e) => { e.stopPropagation(); handleChannelClick(item.uploaderUrl); }}>
                {item.uploaderName} • {item.views ? formatViews(item.views) : 'N/A'} views • {item.uploadedDate}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
