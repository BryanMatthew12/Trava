import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../api/login/login';
import { logout } from '../slices/auth/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout()); // Clear any previous session on mount
  })

  const handleLogin = async (e) => {
    e.preventDefault();

    setError({ email: '', password: '' });

    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
    let hasError = false;

    if (!email) {
      setError((prev) => ({ ...prev, email: 'Please enter your email address' }));
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      hasError = true;
    } else {
      const emailDomain = email.split('@')[1];
      if (!allowedDomains.includes(emailDomain)) {
        setError((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
        hasError = true;
      }
    }

    if (!password) {
      setError((prev) => ({ ...prev, password: 'Please enter your password' }));
      hasError = true;
    }

    if (hasError) return;

    try {
      await login(email, password, dispatch, navigate);
    } catch (error) {
      console.error('Login error:', error.message);
      setError((prev) => ({ ...prev, email: "Your email or password is incorrect." }));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-6">Log in to Trava</h1>

        <form onSubmit={handleLogin}>
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Log in
          </button>
        </form>


        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a onClick={() => navigate("/register")} className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;