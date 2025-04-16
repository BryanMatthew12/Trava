import { createSlice } from '@reduxjs/toolkit';

const threadSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [], // Initialize threads as an empty array
  },
  reducers: {
    setThreads: (state, action) => {
      state.threads = action.payload.map((thread) => ({
        user_id: thread.user_id,
        itinerary_id: thread.itinerary_id,
        id: thread.thread_id,
        title: thread.thread_title,
        description: thread.thread_content,
        picture: thread.thread_picture,
        likes: thread.likes,
        views: thread.views,
      }));
    },
    clearThreads: (state) => {
      state.threads = []; // Clear the threads
    },
  },
});

export const { setThreads, clearThreads } = threadSlice.actions;

// Selectors
export const selectThreads = (state) => state.threads.threads;
export const selectThreadsByUserId = (userId) => (state) =>
  state.threads.threads.filter((thread) => thread.user_id === userId);

export default threadSlice.reducer;