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
        description: place.place_description,
        category: place.category_id,
        place_picture: place.place_picture,
        operational: place.operational, // Ensure this is mapped correctly
        location: place.location,
        price: place.place_est_price,
        rating: place.place_rating, // Ensure this is mapped correctly
      }));
    },
    appendPlaces: (state, action) => {
      const newPlaces = action.payload.map((place) => ({
        id: place.place_id,
        name: place.place_name,
        description: place.place_description,
        category: place.category_id,
        place_picture: place.place_picture,
        location: place.location,
        price: place.place_est_price,
        rating: place.place_rating,
      }));

      // Filter out places with duplicate IDs
      const filteredPlaces = newPlaces.filter(
        (newPlace) => !state.places.some((existingPlace) => existingPlace.id === newPlace.id)
      );

      state.places = [...state.places, ...filteredPlaces]; // Append only unique places
    },
    clearPlaces: (state) => {
      state.places = []; // Clear the places
    },
  },
});

export const { setPlaces, appendPlaces, clearPlaces } = placeSlice.actions;

// Selector to get all places
export const selectPlaces = (state) => state.places.places;

// Selector to get a place by ID
export const selectPlacesById = (id) => (state) =>
  state.places.places.find((place) => place.id === id);

// Optional: Selector to get the top 5 places by rating
export const selectTop5Places = (state) => {
  return [...state.places.places]
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    // .slice(0, 5);
};

export default placeSlice.reducer;