import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRoleId } from '../slices/auth/authSlice';
import logo from '../assets/img/travalogo.png';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleId = useSelector(selectRoleId);

  // Helper to check if current path matches
  const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <header className="bg-white text-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Trava Logo" className="w-20 h-auto mr-2" />
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li
              className={`cursor-pointer hover:text-blue-500 ${isActive('/Home') ? 'text-blue-600 font-bold' : ''}`}
              onClick={() => navigate('/Home')}
            >
              Home
            </li>
            <li
              className={`cursor-pointer hover:text-blue-500 ${isActive('/Destinations') ? 'text-blue-600 font-bold' : ''}`}
              onClick={() => navigate('/Destinations')}
            >
              Destinations
            </li>
            <li
              className={`cursor-pointer hover:text-blue-500 ${isActive('/Threads') ? 'text-blue-600 font-bold' : ''}`}
              onClick={() => navigate('/Threads')}
            >
              Threads
            </li>
            <li
              className={`cursor-pointer hover:text-blue-500 ${isActive('/PrePlanningItinerary') ? 'text-blue-600 font-bold' : ''}`}
              onClick={() => navigate('/PrePlanningItinerary')}
            >
              Plan Your Itinerary
            </li>
            <li
              className={`cursor-pointer hover:text-blue-500 ${isActive('/Profile') ? 'text-blue-600 font-bold' : ''}`}
              onClick={() => navigate('/Profile')}
            >
              Profile
            </li>
            {roleId == '1' && (
              <li
                className={`cursor-pointer hover:text-blue-500 ${isActive('/Admin') ? 'text-blue-600 font-bold' : ''}`}
                onClick={() => navigate('/Admin')}
              >
                Admin
              </li>
            )}
          </ul>
        </nav>

        <div className="flex items-center"></div>
      </div>
    </header>
  );
};

export default Header;
