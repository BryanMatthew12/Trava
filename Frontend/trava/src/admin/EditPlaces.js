import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getAllPlaces } from '../api/places/getAllPlaces';

const selectStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: '#dddddd',
    border: 'none',
    minHeight: '48px',
    boxShadow: 'none',
  }),
  input: (provided) => ({
    ...provided,
    color: '#888',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#888',
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
  }),
};

const PAGE_SIZE = 20;

const EditPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Fetch first page on mount
  useEffect(() => {
    const fetchInitialPlaces = async () => {
      setIsLoading(true);
      try {
        const data = await getAllPlaces(1);
        console.log('Fetched places:', data); // CEK DATA DI SINI
        setPlaces(data);
        setHasMore(data.length === PAGE_SIZE);
        setPage(1);
      } catch (error) {
        setPlaces([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialPlaces();
  }, []);

  // Handler for loading next page when scroll to bottom
  const handleNextPage = async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const data = await getAllPlaces(nextPage);
      setPlaces((prev) => [...prev, ...data]);
      setHasMore(data.length === PAGE_SIZE);
      setPage(nextPage);
    } catch (error) {
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const placeOptions = places.map((place) => ({
    value: place.place_id,
    label: place.place_name,
    description: place.place_description,
  }));

  return (
    <>
      <h2 className="text-xl font-bold mb-4">Edit Places</h2>
      <div className="mb-10 w-80">
        <Select
          options={placeOptions}
          value={placeOptions.find((opt) => opt.value === selectedPlace)}
          onChange={(option) => setSelectedPlace(option?.value)}
          placeholder="Edit a Place"
          isSearchable
          classNamePrefix="react-select"
          styles={selectStyles}
          onMenuScrollToBottom={handleNextPage}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default EditPlaces;