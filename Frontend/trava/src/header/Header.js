import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRoleId } from '../slices/auth/authSlice';
import logo from '../assets/img/travalogo.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleId = useSelector(selectRoleId);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', path: '/Home' },
    { label: 'Destinations', path: '/Destinations' },
    { label: 'Threads', path: '/Threads' },
    { label: 'Plan Your Itinerary', path: '/PrePlanningItinerary' },
    { label: 'Profile', path: '/Profile' },
  ];

  if (roleId == '1') {
    menuItems.push({ label: 'Admin', path: '/Admin' });
  }

  // Helper to check if current path matches
  const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

  return (
    <header className="bg-white text-gray-800 p-4 shadow-md relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src={logo} alt="Trava Logo" className="w-20 h-auto mr-2" />
        </div>

        {/* Desktop menu */}
        <nav className="hidden sm:flex flex-1 justify-center">
          <ul className="flex space-x-6">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="cursor-pointer hover:text-blue-500"
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>

        {/* Hamburger icon for mobile */}
        <button
          className="block sm:hidden text-2xl z-30" // z-30 agar di atas menu mobile
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden absolute left-0 top-full w-full bg-white shadow z-40 animate-fade-in">
          <ul className="flex flex-col py-2">
            {menuItems.map((item) => (
              <li
                key={item.label}
                className="px-6 py-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(item.path);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;