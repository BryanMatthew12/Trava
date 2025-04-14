import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../api/login/register";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "", confirmPassword: "" });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError({ email: "", password: "", confirmPassword: "" });
  

    if (!email) {
      setError((prev) => ({ ...prev, email: "Please enter your email address" }));
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      return;
    }
  
    if (!password) {
      setError((prev) => ({ ...prev, password: "Please enter a password" }));
      return;
    }
  
    if (password !== confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }
  
    try {
      await register(name, email, password, confirmPassword, dispatch, navigate);
    } catch (error) {
      console.error("Registration failed:", error.message);
    }finally{
      navigate("/preference");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-6">Sign up to Trava</h1>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full border ${
                error.email ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                error.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Enter your email"
            />
            {error.email && <p className="text-red-500 text-sm mt-1">{error.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border ${
                error.password ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                error.password ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Enter your password"
            />
            {error.password && <p className="text-red-500 text-sm mt-1">{error.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full border ${
                error.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-md px-4 py-2 focus:outline-none focus:ring-2 ${
                error.confirmPassword ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              placeholder="Confirm your password"
            />
            {error.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{error.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Sign up with email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;