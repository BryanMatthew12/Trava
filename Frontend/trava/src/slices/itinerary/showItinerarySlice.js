import { createSlice } from '@reduxjs/toolkit';

const showItinerarySlice = createSlice({
  name: 'showItinerary',
  initialState: {
    destination_name: '',
    start_date: '',
    end_date: '',
    places: [], // Menyimpan daftar tempat
  },
  reducers: {
    setItineraryDetails: (state, action) => {
      const { destination_name, start_date, end_date, places } = action.payload;
      state.destination_name = destination_name;
      state.start_date = start_date;
      state.end_date = end_date;
      state.places = places;
    },
    clearItineraryDetails: (state) => {
      state.destination_name = '';
      state.start_date = '';
      state.end_date = '';
      state.places = [];
    },
  },
});

export const { setItineraryDetails, clearItineraryDetails } = showItinerarySlice.actions;

// Selectors
export const selectItineraryDetails = (state) => state.showItinerary;

export default showItinerarySlice.reducer;