import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null,
    name: null,
    user_id: null,
    role: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      Cookies.set('token', action.payload, { expires: 1 / 24 });
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setUserId: (state, action) => {
      state.user_id = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
      state.user_id = null;
      state.role = null;
      Cookies.remove('token');
    },
  },
});

export const { setToken, setName, setUserId, setRole, logout } = authSlice.actions;

// Selectors
export const selectToken = (state) => state.auth.token;
export const selectName = (state) => state.auth.name;
export const selectUserId = (state) => state.auth.user_id;
export const selectRole = (state) => state.auth.role;

export default authSlice.reducer;