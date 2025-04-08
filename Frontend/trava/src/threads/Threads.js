import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Header from './threadsComponent/Header';
import SortDropdown from './threadsComponent/SortDropdown';
import ThreadsGrid from './threadsComponent/ThreadsGrid';
import axios from 'axios';
// Import images
import jakartaImg from '../assets/img/jakarta.jpg';
import bandungImg from '../assets/img/bandung.jpg';
import baliImg from '../assets/img/bali.jpg';
import yogyakartaImg from '../assets/img/yogyakarta.jpg';
import surabayaImg from '../assets/img/surabaya.jpg';
import lombokImg from '../assets/img/lombok.jpg';
import medanImg from '../assets/img/medan.jpg';
import makassarImg from '../assets/img/makassar.jpg';
import semarangImg from '../assets/img/semarang.jpg';
import acehImg from '../assets/img/aceh.jpg';
import manadoImg from '../assets/img/manado.jpg';
import palembangImg from '../assets/img/palembang.jpg';

const Threads = () => {
  const [sortOption, setSortOption] = useState(1); // Default to "Most Recent"

  const sortOptions = [
    { value: 1, label: 'Most Recent' },   // Default order
    { value: 2, label: 'Most Popular' }, // Sort by highest views
    { value: 3, label: 'Most Liked' },   // Sort by highest likes
  ];

  const guides = [
    { title: 'Jakarta: Good Cities to Stay', description: 'Explore Jakarta...', author: 'John Doe', likes: 15234, views: 89234, image: jakartaImg },
    { title: 'Bandung: Best Culinary in Indonesia', description: 'Discover Bandung...', author: 'Jane Smith', likes: 12345, views: 75432, image: bandungImg },
    { title: 'Bali: Island of the Gods', description: 'Experience Bali...', author: 'Alex Johnson', likes: 9876, views: 65432, image: baliImg },
    { title: 'Yogyakarta: Cultural Heritage', description: 'Visit Yogyakarta...', author: 'Emily Davis', likes: 8765, views: 54321, image: yogyakartaImg },
    { title: 'Surabaya: City of Heroes', description: 'Explore Surabaya...', author: 'Michael Brown', likes: 7654, views: 43210, image: surabayaImg },
    { title: 'Lombok: Hidden Paradise', description: 'Relax on Lombok...', author: 'Sarah Wilson', likes: 6543, views: 32109, image: lombokImg },
    { title: 'Medan: Gateway to Lake Toba', description: 'Discover Medan...', author: 'Chris Lee', likes: 5432, views: 21098, image: medanImg },
    { title: 'Makassar: Culinary and History', description: 'Visit Makassar...', author: 'Anna Taylor', likes: 4321, views: 10987, image: makassarImg },
    { title: 'Semarang: Blend of Cultures', description: 'Explore Semarang...', author: 'David Clark', likes: 3210, views: 9876, image: semarangImg },
    { title: 'Aceh: Gateway to Tsunami History', description: 'Learn about Aceh...', author: 'Emily Carter', likes: 2890, views: 8765, image: acehImg },
    { title: 'Manado: Diving Paradise', description: 'Dive into Manado...', author: 'James White', likes: 2456, views: 7654, image: manadoImg },
    { title: 'Palembang: Culinary and History', description: 'Visit Palembang...', author: 'Sophia Green', likes: 1987, views: 6543, image: palembangImg },
  ];

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
  };

  const sortedGuides = [...guides].sort((a, b) => {
    if (sortOption === 2) return b.views - a.views; // Most Popular
    if (sortOption === 3) return b.likes - a.likes; // Most Liked
    return 0; // Default order
  });

  useEffect(() => {
    const response = async () => {
      try {
        const result = await axios.get('http://127.0.0.1:8000/api/v1/threads?title='); // Replace with your API endpoint
        console.log(result.data);
      } catch (error) {
        console.error('Error fetching guides:', error);
      }
    };
    response();
  }, [])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Threads</h2>
        <SortDropdown sortOptions={sortOptions} handleSortChange={handleSortChange} />
      </div>
      <ThreadsGrid guides={sortedGuides} />
      <div className="flex justify-center mt-8">
        <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">See more</button>
      </div>
    </div>
  );
};

export default Threads;