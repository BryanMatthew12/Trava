import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md bg-slate-400">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/')}>
          TravelApp
        </h1>
        <nav>
          <ul className="flex space-x-6">
            <li className="cursor-pointer hover:text-gray-200" onClick={() => navigate('/Home')}>
              Home
            </li>
            <li className="cursor-pointer hover:text-gray-200" onClick={() => navigate('/Destinations')}>
              Destinations
            </li>
            <li className="cursor-pointer hover:text-gray-200" onClick={() => navigate('/Threads')}>
              Threads
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
