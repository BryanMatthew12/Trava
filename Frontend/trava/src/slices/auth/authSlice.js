import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null, // Load token from the cookie
    name: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      Cookies.set('token', action.payload); // Save token to the cookie
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
      Cookies.remove('token'); // Remove token from the cookie
    },
  },
});

export const { setToken, setName, logout } = authSlice.actions;
export const token = (state) => state.auth.token;
export const name = (state) => state.auth.name;
export default authSlice.reducer;