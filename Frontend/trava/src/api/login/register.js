import { setToken, setName } from "../../slices/auth/authSlice";
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
      dispatch(setToken(response.data.token)); // Save token to Redux and cookie
      dispatch(setName(response.data.user.username)); // Save username to Redux
      return response.data; // Return the response to indicate success
    } else {
      throw new Error("Registration failed: Token not found");
    }
  } catch (error) {
    console.error("Register error:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || "Registration failed");
  } finally {
    // Navigate to /preference after the try-catch block
    navigate("/preference");
  }
};