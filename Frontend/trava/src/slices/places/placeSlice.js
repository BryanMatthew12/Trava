import { createSlice } from '@reduxjs/toolkit';

const placeSlice = createSlice({
  name: 'places',
  initialState: {
    places: [],
  },
  reducers: {
    setPlaces: (state, action) => {
      state.places = action.payload.map((place) => ({
        id: place.place_id,
        name: place.place_name,
        description: place.description,
        category: place.category_id,
        place_picture: place.place_picture,
        location: place.location,
        price: place.place_est_price,
        rating: place.place_rating,
      }));
    },
    clearDestinations: (state) => {
      state.places = []; // Clear the destinations
    },
  },
});

export const { setPlaces, clearPlaces } = placeSlice.actions;

export const selectPlaces = (state) => state.places.places;

export const selectPlacesById = (id) => (state) =>
  state.places.places.find((place) => place.id === id);

export default placeSlice.reducer;