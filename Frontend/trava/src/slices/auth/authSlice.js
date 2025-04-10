// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    name: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.name = null;
    },
  },
});

export const { setToken, setName, logout } = authSlice.actions;
export const token = (state) => state.auth.token;
export const name = (state) => state.auth.name;
export default authSlice.reducer;
