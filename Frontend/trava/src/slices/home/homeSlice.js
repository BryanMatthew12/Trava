import { createSlice } from '@reduxjs/toolkit';

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    home: [],
  },
  reducers: {
    setHome: (state, action) => {
      console.log("Places data from API:", action.payload); // Debugging
      state.home = action.payload.map((home) => ({
        id: home.place_id,
        name: home.place_name,
        description: home.place_description,
        category: home.category_id,
        place_picture: home.place_picture,
        location: home.location,
        price: home.place_est_price,
        rating: home.place_rating, // Ensure this is mapped correctly
      }));
      console.log("Mapped places:", state.home); // Debugging
    },
    clearHome: (state) => {
      state.home = []; // Clear the places
    },
  },
});

export const { setHome, clearHome } = homeSlice.actions;

// Selector to get all places
export const selectHome = (state) => state.home.home;

// Selector to get a place by ID
export const selectHomeById = (id) => (state) =>
  state.home.home.find((place) => place.id === id);

// Selector to get places by category IDs
export const selectHomesByCategoryIds = (categoryIds) => (state) => {
  console.log("Filtering homes by category IDs:", categoryIds); // Debugging
  if (!categoryIds || categoryIds.length === 0) {
    console.log("No category IDs provided. Returning all homes.");
    return state.home.home; // Return all homes if no category IDs are provided
  }
  return state.home.home.filter((place) => {
    console.log("Place category:", place.category); // Debugging
    return categoryIds.includes(place.category || 0);
  });
};

// Optional: Selector to get the top 5 places by rating
export const selectTop5Places = (state) => {
  return [...state.home.home]
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 5);
};

export default homeSlice.reducer;