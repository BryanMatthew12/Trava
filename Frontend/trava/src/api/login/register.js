import { setToken, setName, setUserId, setRole } from "../../slices/auth/authSlice";
import { BASE_URL } from "../../config";
import axios from "axios";

export const register = async (name, email, password, confirmPassword, dispatch, navigate) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      username: name,
      email: email,
      password: password,
      password_confirmation: confirmPassword,
    });

    if (response.data && response.data.token) {
      dispatch(setToken(response.data.token));
      dispatch(setName(response.data.user.username));
      dispatch(setUserId(response.data.user.user_id));
      dispatch(setRole(response.data.user.role));
      return response.data;
    } else {
      throw new Error("Registration failed: Token not found");
    }
  } catch (error) {
    console.error("Register error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  } finally {
    navigate("/preference");
  }
};