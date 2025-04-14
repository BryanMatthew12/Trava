import { createSlice } from '@reduxjs/toolkit';

const destinationSlice = createSlice({
  name: 'destinations',
  initialState: {
    destinations: [],
  },
  reducers: {
    setDestinations: (state, action) => {
      state.destinations = action.payload.map((destination) => ({
        id: destination.destination_id,
        name: destination.destination_name,
        // description: destination.description,
        // content: destination.content,
        // destination_picture: destination.destination_picture,
      }));
    },
    clearDestinations: (state) => {
      state.destinations = []; // Clear the destinations
    },
  },
});

export const { setDestinations, clearDestinations } = destinationSlice.actions;

export const selectDestinations = (state) => state.destinations.destinations;

export const selectDestinationById = (id) => (state) =>
  state.destinations.destinations.find((destination) => destination.id === id);

export default destinationSlice.reducer;