import { setToken, setName, setUserId, setRole } from "../../slices/auth/authSlice";
import { BASE_URL } from '../../config';
import axios from "axios";

export const login = async (email, password, dispatch, navigate) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: email,
      password: password,
    });

    if (response.data) {
      dispatch(setToken(response.data.token));
      dispatch(setName(response.data.user.username));
      dispatch(setUserId(response.data.user.user_id));
      dispatch(setRole(response.data.user.role));
      navigate('/home'); 
      return response.data;
    } else {
      throw new Error('Login failed: Token not found');
    }
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};