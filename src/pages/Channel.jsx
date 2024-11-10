// src/pages/Channel.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import formatViews from '../utils/formatViews';

const Channel = () => {
  const { channelId } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [relatedStreams, setRelatedStreams] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const observerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`https://pipedapi.reallyaweso.me/channel/${channelId}`);
        setChannelData(response.data);
        setRelatedStreams(response.data.relatedStreams || []);
        setNextPage(response.data.nextpage);
      } catch (error) {
        console.error('Error fetching channel data:', error);
      }
    };

    fetchChannelData();
  }, [channelId]);

  const handleVideoClick = (videoId) => {
    navigate(`/watch/${videoId}`);
  };

  const handleLoadMore = async () => {
    if (nextPage) {
      try {
        const response = await axios.get(`https://pipedapi.reallyaweso.me/nextpage/channel/${channelId}?nextpage=${encodeURIComponent(nextPage)}`);
        setRelatedStreams([...relatedStreams, ...response.data.relatedStreams]);
        setNextPage(response.data.nextpage);
      } catch (error) {
        console.error('Error fetching more related streams:', error);
      }
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
  }, [relatedStreams, nextPage]);

  if (!channelData) return <div>Loading...</div>;

  return (
    <div className="py-4 mt-14 bg-black text-white">
          <img src={channelData.bannerUrl} alt={channelData.name} className="w-full h-24 rounded-xl px-2" />
      <div className="flex streams-center my-4 px-2">
        <img src={channelData.avatarUrl} alt={channelData.name} className="w-16 h-16 rounded-full mr-4" />

        <div >
          <h1 className="text-2xl font-bold">{channelData.name}</h1>
          <p className="text-gray-300">{formatViews(channelData.subscriberCount)} subscribers</p>
        </div>
      </div>
      <p className="mb-4 px-2">{channelData.description}</p>
      <h2 className="text-xl font-bold mb-4 px-2">Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedStreams.map((stream, index) => (
          <div
            key={stream.url}
            className="  cursor-pointer"
            onClick={() => handleVideoClick(stream.url.split('=')[1])}
            ref={index === relatedStreams.length - 1 ? observerRef : null}
          >
            <img src={stream.thumbnail} alt={stream.title} className="w-full h-auto" />
            <div className='flex py-4 px-2'>
            <img src={channelData.avatarUrl} className='w-10 h-10 rounded-full' onClick={(e) => { e.stopPropagation(); handleChannelClick(stream.uploaderUrl); }}/>
            <div className='flex flex-col '>
              <h2 className="text-sm px-3 ">{stream.title || stream.name}</h2>
              <p className="text-xs text-gray-500 px-3 mt-2" onClick={(e) => { e.stopPropagation(); handleChannelClick(stream.uploaderUrl); }}>
                {stream.uploaderName} • {stream.views ? formatViews(stream.views) : 'N/A'} views • {stream.uploadedDate}
              </p>
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Channel;
