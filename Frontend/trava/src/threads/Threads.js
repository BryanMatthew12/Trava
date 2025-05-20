import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './threadsComponent/Header';
import ThreadsGrid from './threadsComponent/ThreadsGrid';
import SortDropdown from './threadsComponent/SortDropdown';
import ThreadDetails from './threadsComponent/ThreadDetails';
import axios from 'axios';
import { BASE_URL } from '../config';
import { searchThread } from '../api/thread/searchThread'; // Tambahkan import

const Threads = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState(1);

  const token = useSelector((state) => state.auth.token);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get('source');
  const threadId = queryParams.get('thread_id');
  const itineraries_id = queryParams.get('itineraries_id');

  // Fetch threads dari API (untuk infinite scroll & default)
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

  // Pencarian dengan searchThread.js
  const handleSearchResults = async (searchQuery) => {
    setQuery(searchQuery);
    setPage(1);
    setHasMore(true);

    // Jika search kosong, pakai fetchThreads (default)
    if (!searchQuery) {
      fetchThreads(1, '', sortOption);
      return;
    }

    setLoading(true);
    try {
      const result = await searchThread({ name: searchQuery });
      setThreads(result.data || []);
      setHasMore(false); // Disable infinite scroll saat search
    } catch (error) {
      setThreads([]);
    }
    setLoading(false);
  };

  // Infinite scroll hanya aktif jika tidak sedang search
  useEffect(() => {
    if (!query) {
      fetchThreads(page, '', sortOption);
    }
    // eslint-disable-next-line
  }, [page, sortOption]);

  // Reset page saat sort berubah
  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
    setPage(1);
    setHasMore(true);
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading && !query) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [hasMore, loading, query]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header onSearch={handleSearchResults} />
      <SortDropdown handleSortChange={handleSortChange} />
      {itineraries_id ? (
        <ThreadDetails />
      ) : (
        <ThreadsGrid guides={threads} loading={loading} />
      )}
    </div>
  );
};

export default Threads;