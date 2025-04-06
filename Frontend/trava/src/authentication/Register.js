import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHiking, faSpa, faLandmark, faTree } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const [showCategorySection, setShowCategorySection] = useState(false); // State to toggle category section
  const [selectedCategories, setSelectedCategories] = useState([]); // State to store selected categories
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    // Reset errors
    setError({ email: '', password: '' });

    // Simple validation
    if (!email) {
      setError((prev) => ({ ...prev, email: 'Please enter your email address' }));
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }
    if (!password) {
      setError((prev) => ({ ...prev, password: 'Please enter a password' }));
      return;
    }

    if (email && password) {
      // Handle registration logic here
      alert('Registration successful!');
      setShowCategorySection(true); // Show category section after registration
    }
  };

  const handleCategoryToggle = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((item) => item !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleCategorySubmit = () => {
    if (selectedCategories.length === 0) {
      alert('No category selected. Proceeding without preferences.');
    } else {
      alert(`You selected: ${selectedCategories.join(', ')}`);
    }
    navigate('/Home'); // Redirect to threads or another page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {!showCategorySection ? (
          <>
            <h1 className="text-xl font-bold text-center mb-6">Sign up to Trava</h1>

            <form onSubmit={handleRegister}>
              {/* Email Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full border ${
                    error.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                    error.email ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                  }`}
                  placeholder="Enter your email"
                />
                {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border ${
                      error.password ? 'border-red-500' : 'border-gray-300'
                    } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                      error.password ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                    }`}
                    placeholder="Enter your password"
                  />
                </div>
                {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Sign up with email
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:underline">
                Log in
              </a>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-center mb-6">Choose Your Preferences</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Adventure */}
              <div
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer ${
                  selectedCategories.includes('Adventure') ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleCategoryToggle('Adventure')}
              >
                <FontAwesomeIcon icon={faHiking} className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Adventure</span>
              </div>

              {/* Relaxation */}
              <div
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer ${
                  selectedCategories.includes('Relaxation') ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleCategoryToggle('Relaxation')}
              >
                <FontAwesomeIcon icon={faSpa} className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Relaxation</span>
              </div>

              {/* Cultural */}
              <div
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer ${
                  selectedCategories.includes('Cultural') ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleCategoryToggle('Cultural')}
              >
                <FontAwesomeIcon icon={faLandmark} className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Cultural</span>
              </div>

              {/* Nature */}
              <div
                className={`border rounded-md p-4 flex flex-col items-center cursor-pointer ${
                  selectedCategories.includes('Nature') ? 'border-blue-500' : 'border-gray-300'
                }`}
                onClick={() => handleCategoryToggle('Nature')}
              >
                <FontAwesomeIcon icon={faTree} className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm font-medium text-gray-700">Nature</span>
              </div>
            </div>

            <button
              onClick={handleCategorySubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Submit Preferences
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;