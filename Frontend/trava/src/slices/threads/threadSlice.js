import { createSlice } from '@reduxjs/toolkit';

const threadSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [],
  },
  reducers: {
    setThreads: (state, action) => {
      state.threads = action.payload.map((thread) => ({
        id: thread.thread_id,
        name: thread.thread_title,
        description: thread.thread_content,
        picture: thread.thread_picture,
        likes: thread.likes,
        views: thread.views,
        comments: thread.comments,
      }));
    },
    clearThreads: (state) => {
      state.places = []; // Clear the destinations
    },
  },
});

export const { setThreads, clearThreads } = threadSlice.actions;

export const selectThreads = (state) => state.threads.threads;

export const selectThreadById = (id) => (state) =>
  state.places.places.find((place) => place.id === id);

export default threadSlice.reducer;