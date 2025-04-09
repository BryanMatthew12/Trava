import React, { useState, useEffect } from 'react';
import Header from './threadsComponent/Header';
import SortDropdown from './threadsComponent/SortDropdown';
import ThreadsGrid from './threadsComponent/ThreadsGrid';
import axios from 'axios';

const Threads = () => {
  const [threads, setThreads] = useState([]); // State to store threads data
  const [sortOption, setSortOption] = useState(1); // Default to "Most Recent"
  const [loading, setLoading] = useState(false); // State to handle loading
  const [page, setPage] = useState(1); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // Whether there are more threads to load

  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYXBpL2F1dGgvbG9naW4iLCJpYXQiOjE3NDQxODA1MTYsImV4cCI6MTc0NDE4NDExNiwibmJmIjoxNzQ0MTgwNTE2LCJqdGkiOiJPY21YbGt4OHVUVXdVeThSIiwic3ViIjoiMSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJ1c2VybmFtZSI6Ik5pa28iLCJlbWFpbCI6Im5pa29AZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.J3c04QJ3-XDwjJHlCixHUDhuvcweY2mjplZ8-vJDyMw'; // Replace with your actual token

  const sortOptions = [
    { value: 1, label: 'Most Recent' },   // Default order
    { value: 2, label: 'Most Popular' }, // Sort by highest views
    { value: 3, label: 'Most Liked' },   // Sort by highest likes
  ];

  // Fetch threads from the API
  const fetchThreads = async (page) => {
    setLoading(true); // Set loading to true while fetching
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/v1/threads?page=${page}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Use the token here
        },
      });

      const newThreads = response.data.data; // Assuming the API response has a "data" field
      setThreads((prevThreads) => [...prevThreads, ...newThreads]); // Append new threads to the existing list
      setHasMore(page < response.data.last_page); // Check if there are more pages to load
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchThreads(page); // Fetch threads when the component mounts or page changes
  }, [page]);

  // Handle sorting
  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
  };

  // Handle search results from Header
  const handleSearchResults = (searchResults) => {
    setThreads(searchResults); // Replace the current threads with the search results
    setHasMore(false); // Disable lazy loading when searching
  };

  // Sort threads based on the selected option
  const sortedThreads = [...threads].sort((a, b) => {
    if (sortOption === 2) return b.views - a.views; // Most Popular
    if (sortOption === 3) return b.likes - a.likes; // Most Liked
    return 0; // Default order
  });

  // Handle scroll event for lazy loading
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      if (hasMore && !loading) {
        setPage((prevPage) => prevPage + 1); // Load the next page
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, [hasMore, loading]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header onSearch={handleSearchResults} token={token} /> {/* Pass the token to Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Threads</h2>
        <SortDropdown sortOptions={sortOptions} handleSortChange={handleSortChange} />
      </div>
      <ThreadsGrid guides={sortedThreads} />
      {loading && <div className="text-center mt-4">Loading...</div>}
      {/* {!hasMore && <div className="text-center mt-4 text-gray-500">Threads doesn't found.</div>} */}
      {threads.length === 0 && !loading && (
        <div className="text-center mt-4 text-gray-500">No threads available.</div>
      )}
    </div>
  );
};

export default Threads;