import React from 'react';
import Profile from './profile/Profile';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/travalogo.png';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white text-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Trava Logo" className="w-20 h-auto mr-2" />
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/Home')}>
              Home
            </li>
            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/Destinations')}>
              Destinations
            </li>
            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/Threads')}>
              Threads
            </li>
            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/PrePlanningItinerary')}>
              Plan Your Itinerary
            </li>
            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/Profile')}>
              Profile
            </li>
            <li className="cursor-pointer hover:text-blue-500" onClick={() => navigate('/Admin')}>
              Admin
            </li>
          </ul>
        </nav>

        <div className="flex items-center border border-gray-300 rounded-md px-2 py-1">
          <input
            type="text"
            placeholder="Search bar"
            className="outline-none text-sm text-gray-600 placeholder-gray-400"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
