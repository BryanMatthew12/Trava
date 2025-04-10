import { setToken, setName } from "../../slices/auth/authSlice";
import { BASE_URL } from '../../config';
import axios from "axios";

export const login = async (email, password, dispatch, navigate) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });

    if (response.data) {
      console.log(response.data.user.username);
      dispatch(setToken(response.data.token)); // Save token to Redux and cookie
      dispatch(setName(response.data.user.username));
      navigate('/home'); // Redirect to /home
      return response.data;
    } else {
      throw new Error('Login failed: Token not found');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};