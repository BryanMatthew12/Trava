import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from './threadsComponent/Header';
import ThreadsGrid from './threadsComponent/ThreadsGrid';
import SortDropdown from './threadsComponent/SortDropdown';
import axios from 'axios';
import { BASE_URL } from '../config';

const Threads = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState(1);

  const token = useSelector((state) => state.auth.token);

  const fetchThreads = async (page, query = '', sortOption = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/v1/threads?page=${page}&title=${query}&sort_by=${sortOption}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const newThreads = response.data.data;
      if (page === 1) {
        setThreads(newThreads);
      } else {
        setThreads((prevThreads) => [...prevThreads, ...newThreads]);
      }
      setHasMore(page < response.data.last_page);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads(page, query, sortOption);
  }, [page, query, sortOption]);

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
    setPage(1);
    setHasMore(true);
  };

  const handleSearchResults = (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setHasMore(true);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header onSearch={handleSearchResults} />
      <SortDropdown handleSortChange={handleSortChange} /> 
      <ThreadsGrid guides={threads} loading={loading} /> 
    </div>
  );
};

export default Threads;