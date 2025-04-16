import { createSlice } from '@reduxjs/toolkit';

const placeSlice = createSlice({
  name: 'places',
  initialState: {
    places: [],
  },
  reducers: {
    setPlaces: (state, action) => {
      console.log("Places data from API:", action.payload); // Debugging
      state.places = action.payload.map((place) => ({
        id: place.place_id,
        name: place.place_name,
        description: place.place_description,
        category: place.category_id,
        category: place.category_id,
        place_picture: place.place_picture,
        location: place.location,
        price: place.place_est_price,
        rating: place.place_rating, // Ensure this is mapped correctly
      }));
      console.log("Mapped places:", state.places); // Debugging
    },
    clearPlaces: (state) => {
      state.places = []; // Clear the places
    },
  },
});

export const { setPlaces, clearPlaces } = placeSlice.actions;

// Selector to get all places
export const selectPlaces = (state) => state.places.places;

// Selector to get a place by ID
export const selectPlacesById = (id) => (state) =>
  state.places.places.find((place) => place.id === id);

// Optional: Selector to get the top 5 places by rating
export const selectTop5Places = (state) => {
  return [...state.places.places]
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 5);
};

export default placeSlice.reducer;