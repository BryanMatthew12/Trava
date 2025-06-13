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
  const [apiError, setApiError] = useState(""); // State for API error messages

  const handleRegister = async (e) => {
  e.preventDefault();
  setError({ email: "", password: "", confirmPassword: "" });
  setApiError(""); // Clear previous API error

  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];

  if (!email) {
    setError((prev) => ({
      ...prev,
      email: "Please enter your email address"
    }));
    return;
  }

  const emailRegex = /^\S+@(\S+\.\S+)$/;
  const match = email.match(emailRegex);

  if (!match) {
    setError((prev) => ({
      ...prev,
      email: "Please enter a valid email address"
    }));
    return;
  }

  const domain = match[1].toLowerCase();
  if (!allowedDomains.includes(domain)) {
    setError((prev) => ({
      ...prev,
      email: `Email must end in one of the following domains: ${allowedDomains.join(', ')}`
    }));
    return;
  }

  if (!password) {
    setError((prev) => ({
      ...prev,
      password: "Please enter a password"
    }));
    return;
  }

  if (password !== confirmPassword) {
    setError((prev) => ({
      ...prev,
      confirmPassword: "Passwords do not match"
    }));
    return;
  }

  try {
    const result = await register(name, email, password, confirmPassword, dispatch);
    if (result && result.token) {
      navigate("/preference");
    }
  } catch (error) {
    console.error("Registration failed:", error.message);
    setApiError(error.message || "Registration failed. Please try again.");
  }
};



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-center mb-6">Sign up to Trava</h1>

        {apiError && <p className="text-red-500 text-center mb-4">{apiError}</p>} {/* Display API error */}

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
            Register
          </button>
          
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a onClick={() => navigate("/login")} className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;