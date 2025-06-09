import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import logo from '../assets/img/travalogo.png';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-100 py-8 px-4 sm:px-8 mt-auto">
      <div className="max-w-[85%] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-gray-700">

        <div className="flex flex-col items-center sm:items-start">
          <img src={logo} alt="Logo" className="w-24 h-auto" />
          <p className="text-sm mt-2">© TRAVA, COPYRIGHT 2025</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center sm:justify-between text-center sm:text-left gap-8">
          <div>
            <h3 className="font-bold text-lg mb-2">Trava</h3>
            <ul className="space-y-2">
              <li>
                <a onClick={() => navigate("/PrePlanningItinerary")} className="hover:underline">
                  Planning itinerary
                </a>
              </li>
              <li>
                <a onClick={() => navigate("/Threads")} className="hover:underline">
                  Threads
                </a>
              </li>
              <li>
                <a onClick={() => navigate("/Destinations")} className="hover:underline">
                  Destinations
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Guides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Trips by Cities
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Explore hidden gem
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Explore java
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Best place to visit based on category
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Most popular places in Java
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end">
          <h3 className="font-bold text-lg mb-4">Follow us</h3>
          <div className="flex space-x-5">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-gray-500 hover:text-white" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400"
            >
              <FontAwesomeIcon icon={faFacebook} className="text-gray-500 hover:text-white" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400"
            >
              <FontAwesomeIcon icon={faTwitter} className="text-gray-500 hover:text-white" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;