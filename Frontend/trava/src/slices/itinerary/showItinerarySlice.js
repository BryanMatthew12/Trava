import { createSlice } from '@reduxjs/toolkit';

const showItinerarySlice = createSlice({
  name: 'showItinerary',
  initialState: {
    itineraries: [], // Initialize itineraries as an empty array
  },
  reducers: {
    setItineraries: (state, action) => {
        console.log('action.payload', action.payload);
      // Simpan data itinerary ke state
      state.itineraries = action.payload.map((itinerary) => ({
        id: itinerary.itinerary_id,
        itinerary_name: itinerary.itinerary_name,
        destination_name: itinerary.destination_name,
        start_date: itinerary.start_date,
        end_date: itinerary.end_date,
        itinerary_description: itinerary.itinerary_description,
        places: itinerary.places || [], // Tambahkan daftar tempat jika ada
      }));
    },
    clearItineraries: (state) => {
      // Kosongkan data itinerary
      state.itineraries = [];
    },
  },
});

export const { setItineraries, clearItineraries } = showItinerarySlice.actions;

// Selector untuk mengambil data itinerary dari Redux state
export const selectItineraries = (state) => state.showItinerary.itineraries;

export default showItinerarySlice.reducer;