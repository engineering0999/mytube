// src/pages/Search.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import formatViews from '../utils/formatViews';

const Search = () => {
  const [query, setQuery] = useState(localStorage.getItem('searchQuery') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('searchResults')) || []);
  const [nextPage, setNextPage] = useState(localStorage.getItem('searchNextPage') || null);
  const observerRef = useRef(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      axios.get(`https://pipedapi.reallyaweso.me/opensearch/suggestions/?query=${value}`)
        .then(response => {
          setSuggestions(response.data[1]);
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = (searchQuery = query) => {
    axios.get(`https://pipedapi.reallyaweso.me/search?q=${searchQuery}&filter=all`)
      .then(response => {
        setResults(response.data.items);
        setNextPage(response.data.nextpage);
        setSuggestions([]); // Clear suggestions after search
        localStorage.setItem('searchQuery', searchQuery);
        localStorage.setItem('searchResults', JSON.stringify(response.data.items));
        localStorage.setItem('searchNextPage', response.data.nextpage);
      });
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

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
      axios.get(`https://pipedapi.reallyaweso.me/nextpage/search?nextpage=${encodeURIComponent(nextPage)}&q=${query}&filter=all`)
        .then(response => {
          setResults([...results, ...response.data.items]);
          setNextPage(response.data.nextpage);
          localStorage.setItem('searchResults', JSON.stringify([...results, ...response.data.items]));
          localStorage.setItem('searchNextPage', response.data.nextpage);
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(query); // Ensure the current query is passed
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
  }, [results, nextPage]);

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, []);

  const formatDuration = (durationInSeconds) => {
    if (durationInSeconds === -1) {
      return 'Live';
    }
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className=" my-14 bg-black text-white">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search..."
        className="border p-2 w-full mb-4 bg-black text-white"
        ref={inputRef}
      />

      {suggestions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Suggestions:</h3>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index} className="p-2 border-b cursor-pointer" onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 ">
          <h3 className="text-lg font-semibold p-2">Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((item, index) => (
              <div
                key={item.url}
                className="cursor-pointer relative"
                onClick={() => item.type === 'stream' ? handleVideoClick(item.url.split('=')[1]) : handlePlaylistClick(item.url.split('=')[1])}
                ref={index === results.length - 1 ? observerRef : null}
              >
                <img src={item.thumbnail} alt={item.title || item.name} className="w-full h-auto" />
                <div className={`absolute bottom-24 right-2 text-white text-xs px-2 py-1 rounded ${item.duration === -1 ? 'bg-red-600' : 'bg-black bg-opacity-70'}`}>
                  {item.duration ? formatDuration(item.duration): "Playlist"}
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
        </div>
      )}
    </div>
  );
};

export default Search;
