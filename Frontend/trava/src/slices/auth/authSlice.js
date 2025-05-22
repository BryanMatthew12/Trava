import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null,
    name: null,
    user_id: Cookies.get('user_id') || null,
    role_id: null,
    user_picture: null, // Tambahkan ini
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
      Cookies.set('user_id', action.payload, { expires: 1 / 24 });
    },
    setRoleId: (state, action) => {
      state.role_id = action.payload;
    },
    setUserPicture: (state, action) => { // Tambahkan ini
      state.user_picture = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
      state.user_id = null;
      state.role_id = null;
      state.user_picture = null; // Reset juga
      Cookies.remove('token');
      Cookies.remove('user_id');
    },
  },
});

export const { setToken, setName, setUserId, setRoleId, setUserPicture, logout } = authSlice.actions;

// Selectors
export const selectToken = (state) => state.auth.token;
export const selectName = (state) => state.auth.name;
export const selectUserId = (state) => state.auth.user_id;
export const selectRoleId = (state) => state.auth.role_id;
export const selectUserPicture = (state) => state.auth.user_picture; // Tambahkan ini

export default authSlice.reducer;