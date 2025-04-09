import { setToken } from "../../slices/auth/authSlice";
import { BASE_URL } from '../../config';
import axios from "axios";

export const login = async (email, password, dispatch, navigate) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });

    console.log('Response:', response.data); // Log the response data

    if (response.data && response.data.token) {
      dispatch(setToken(response.data.token)); // Set token in Redux
      navigate('/Home'); // Redirect to /Home
      return response.data;
    } else {
      throw new Error('Login failed: Token not found');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};