import { createSlice } from '@reduxjs/toolkit';

const itinerarySlice = createSlice({
  name: 'itineraries',
  initialState: {
    itineraries: [], // Initialize itineraries as an empty array
  },
  reducers: {
    setItineraries: (state, action) => {
      state.itineraries = action.payload.map((itinerary) => ({
        user_id: itinerary.user_id,
        id: itinerary.itinerary_id, // Corrected from thread_id to itinerary_id
        start: itinerary.start_date,
        end: itinerary.end_date,
        days: itinerary.days,
        budget: itinerary.budget,
        description: itinerary.description,
      }));
    },
    clearItineraries: (state) => {
      state.itineraries = []; // Clear the itineraries
    },
  },
});

export const { setItineraries, clearItineraries } = itinerarySlice.actions;

// Selectors
export const selectItineraries = (state) => state.itineraries.itineraries;
export const selectItineraryByUserId = (userId) => (state) =>
  state.itineraries.itineraries.filter((itinerary) => itinerary.user_id === userId);

export default itinerarySlice.reducer;