// src/pages/VideoPlayer.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Hls from 'hls.js';
import { useParams, useNavigate } from 'react-router-dom';
import formatViews from '../utils/formatViews';
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [relatedStreams, setRelatedStreams] = useState([]);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideoData = async () => {
      const apiList = [
        // Your list of API endpoints
        "https://pipedapi.adminforge.de",
        "https://pipedapi.reallyaweso.me",
        "https://api.piped.private.coffee",
        "https://api.piped.privacydev.net",
        "https://pipedapi.drgns.space",
        "https://pipedapi.darkness.services",
        "https://piped-api.lunar.icu",
        "https://pipedapi.r4fo.com",
        "https://pipedapi.kavin.rocks",
        "https://pipedapi.leptons.xyz",
        "https://api.piped.yt",
        "https://pipedapi.phoenixthrush.com",
        "https://piped-api.codespace.cz",
        "https://pipedapi.ducks.party",
        "https://pipedapi-libre.kavin.rocks",
        "https://pipedapi.ngn.tf",
        "https://pipedapi.smnz.de",
        "https://api.piped.privacydev.net",
        "https://pipedapi.reallyaweso.me",
        "https://pipedapi.adminforge.de",
        "https://pipedapi.kavin.rocks",
        "https://pipedapi-libre.kavin.rocks",
        "https://pipedapi.r4fo.com",
        "https://pipedapi.smnz.de",
        "https://pipedapi.nosebs.ru",
        "https://piped-api.lunar.icu",
        "https://pipedapi.leptons.xyz",
        "https://pipedapi.darkness.services",
        "https://pipedapi.phoenixthrush.com",
        "https://piped-api.codespace.cz",
        "https://pipedapi.ducks.party",
        "https://pipedapi.ngn.tf",
        "https://pipedapi.drgns.space",
        "https://piapi.ggtyler.dev"
      ];

      const requests = apiList.map(api => axios.get(`${api}/streams/${videoId}`));

      try {
        const response = await Promise.any(requests);
        setVideoData(response.data);
        setRelatedStreams(response.data.relatedStreams || []);
      } catch (error) {
        console.error('Error fetching video data:', error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (videoData && videoData.hls) {
      const video = videoRef.current;
      if (Hls.isSupported()) {
        hlsRef.current = new Hls();
        hlsRef.current.loadSource(videoData.hls);
        hlsRef.current.attachMedia(video);

        hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels = hlsRef.current.levels;
          setQualityLevels(levels);
          setSelectedQuality(levels[levels.length - 1].height); // Default to the highest quality
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoData.hls;
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
  }, [videoData]);

  const handleQualityChange = (newQuality) => {
    if (hlsRef.current) {
      const level = qualityLevels.findIndex(level => level.height === newQuality);
      hlsRef.current.nextLevel = level;
      setSelectedQuality(newQuality);
    }
  };

  const handleRelatedStreamClick = (streamId) => {
    navigate(`/watch/${streamId}`);
  };

  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId.split('/')[2]}`);
  };

  const formatDuration = (durationInSeconds) => {
    if (durationInSeconds === -1) {
      return 'Live';
    }
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!videoData) return <div className='text-center flex align-center justify-center text-black mt-[50vh]'>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row bg-black text-white">

      <div className="w-full md:w-2/3 ">
      <div className='w-full p-3 h-12 fixed backdrop-blur-2xl font-bold z-10'>MyTube</div>
        <video ref={videoRef} controls className="w-full lg:w-1/2 h-auto mt-12 fixed z-10"></video>
        <div className='lg:fixed lg:mt-[30%] mt-[65%] md:mt-[90%]'>
        <h1 className="text-lg font-bold pt-4 px-3 bg-black ">{videoData.title}</h1>
        <div className="justify-between items-center mt-2 ">
          <div className="items-center z-10 mx-4">
            <label className="text-sm mr-2">Quality:</label>
            <select
              value={selectedQuality}
              onChange={(e) => handleQualityChange(Number(e.target.value))}
              className="bg-gray-800 text-white p-1 rounded"
            >
              {qualityLevels.map((level) => (
                <option key={level.height} value={level.height}>
                  {level.height}p
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-gray-500 bg-black py-1 px-3 text-xs font-bold">{formatViews(videoData.views)} views</p>
        <div className='flex p-4'>
            <img src={videoData.uploaderAvatar} className='w-10 h-10 rounded-full'  onClick={(e) => { e.stopPropagation(); handleChannelClick(videoData.uploaderUrl); }}/>
        <p className="text-gray-300 text-sm bg-black py-2 px-2 font-bold" onClick={(e) => { e.stopPropagation(); handleChannelClick(videoData.uploaderUrl); }}>{videoData.uploader}</p>
        <p className="text-gray-500 bg-black py-2 text-sm font-bold">{formatViews(videoData.uploaderSubscriberCount)} Subs</p></div>
      <div className='flex '>
      <p className="text-gray-200 bg-gray-900 py-1 ml-4  my-2  flex rounded-lg p-3 font-bold">{formatViews(videoData.likes)}<AiFillLike className='m-1'/></p>
      <p className="text-gray-200 bg-gray-900 py-1  mx-1  my-2 flex rounded-lg p-3 font-bold">{formatViews(videoData.dislikes)}<AiFillDislike className='m-1'/></p></div></div></div>
      <div className="w-full md:w-1/3 ">
        {relatedStreams.map((stream) => (
          <div
            key={stream.url}
            className="cursor-pointer mb-4 relative"
            onClick={() => handleRelatedStreamClick(stream.url.split('=')[1])}
          >
            <img src={stream.thumbnail} alt={stream.title} className="w-full h-auto" />
            <div className={`absolute bottom-28 right-2 text-white text-xs px-2 py-1 rounded ${stream.duration === -1 ? 'bg-red-600' : 'bg-black bg-opacity-70'}`}>
            {formatDuration(stream.duration)}
          </div>
            <div className='flex py-4 px-2'>
            <img src={stream.uploaderAvatar} className='w-10 h-10 rounded-full' onClick={(e) => { e.stopPropagation(); handleChannelClick(stream.uploaderUrl); }}/>
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

export default VideoPlayer;
