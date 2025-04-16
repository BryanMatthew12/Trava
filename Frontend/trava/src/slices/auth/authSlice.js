import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: Cookies.get('token') || null,
    name: null,
    user_id: null,
    role_id: null,
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
    setRoleId: (state, action) => {
      state.role_id = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
      state.user_id = null;
      state.role_id = null;
      Cookies.remove('token');
    },
  },
});

export const { setToken, setName, setUserId, setRoleId, logout } = authSlice.actions;

// Selectors
export const selectToken = (state) => state.auth.token;
export const selectName = (state) => state.auth.name;
export const selectUserId = (state) => state.auth.user_id;
export const selectRoleId = (state) => state.auth.role_id;

export default authSlice.reducer;