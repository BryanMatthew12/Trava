import { createSlice } from '@reduxjs/toolkit';

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    home: [],
    home2: [], // State untuk RowDataRecommended
    home3: [], // Optional: Anda bisa menggunakannya untuk kebutuhan lain
  },
  reducers: {
    setHome: (state, action) => {
      state.home = action.payload.map((home) => ({
        id: home.place_id,
        name: home.place_name,
        description: home.place_description,
        category: home.category_id,
        place_picture: home.place_picture,
        location: home.location,
        price: home.place_est_price,
        rating: home.place_rating,
        views: home.views, // Pastikan views ada
      }));
    },
    setHome2: (state, action) => {
      state.home2 = action.payload.map((home) => ({
        id: home.place_id,
        name: home.place_name,
        description: home.place_description,
        category: home.category_id,
        place_picture: home.place_picture,
        location: home.location,
        price: home.place_est_price,
        rating: home.place_rating,
        views: home.views, // Pastikan views ada
      }));

    },
    setHome3: (state, action) => {
      state.home3 = action.payload.map((home) => ({
        id: home.place_id,
        name: home.place_name,
        description: home.place_description,
        category: home.category_id,
        place_picture: home.place_picture_url,
        location: home.location,
        price: home.place_est_price,
        rating: home.place_rating,
        views: home.views, // Pastikan views ada
      }));
    },
    clearHome: (state) => {
      state.home = []; // Clear the places
      state.home2 = []; // Clear the recommended places
      state.home3= []; // Optional: Clear the third state if needed
    },
  },
});

export const { setHome, setHome2, setHome3, clearHome } = homeSlice.actions;

// Selector to get all places
export const selectHome = (state) => state.home.home;
export const selectHome2 = (state) => state.home.home2;
export const selectHome3 = (state) => state.home.home3;
// Selector to get a place by ID
export const selectHomeById = (id) => (state) =>
  state.home.home.find((place) => place.id === id);
export const selectHome2ById = (id) => (state) =>
  state.home.home2.find((place) => place.id === id);
export const selectHome3ById = (id) => (state) =>
  state.home.home3.find((place) => place.id === id);

// Selector to get places by category IDs
export const selectHomesByCategoryIds = (categoryIds) => (state) => {
  if (!categoryIds || categoryIds.length === 0) {
    return state.home.home; // Return all homes if no category IDs are provided
  }
  return state.home.home.filter((place) => {
    return categoryIds.includes(place.category || 0);
  });
};

// Optional: Selector to get the top 5 places by rating
export const selectTop5Places = (state) => {
  return [...state.home.home]
    .sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0))
    .slice(0, 5);
};

// Selector to get places by user_id and category_id, sorted by rating
export const selectHomesByUserAndCategory = (userId, categoryIds) => (state) => {

  // Filter places based on user_id and category_ids
  const filteredHomes = state.home.home2.filter((place) => {
    return (
      place.user_id === userId && // Match user_id
      categoryIds.includes(place.category) // Match category_id
    );
  });

  // Sort the filtered places by rating in descending order
  return filteredHomes.sort((a, b) => parseFloat(b.rating || 0) - parseFloat(a.rating || 0));
};

// Selector to get hidden gems based on rating and views
export const selectHiddenGems = (state) => {
  const homes = [...state.home.home3];

  if (homes.length === 0) return []; // Return empty array if no data

  // Find the highest rating
  const highestRating = Math.max(...homes.map((home) => parseFloat(home.rating || 0)));

  // Filter homes with rating >= (highestRating - 0.3)
  const filteredHomes = homes.filter(
    (home) => parseFloat(home.rating || 0) >= highestRating - 0.3
  );

  // Sort the filtered homes by views (ascending), then by rating (descending)
  const sortedHomes = filteredHomes.sort((a, b) => {
    if (parseInt(a.views || 0) === parseInt(b.views || 0)) {
      return parseFloat(b.rating || 0) - parseFloat(a.rating || 0); // Sort by rating if views are equal
    }
    return parseInt(a.views || 0) - parseInt(b.views || 0); // Sort by views (ascending)
  });

  // Return the sorted homes
  return sortedHomes;
};

export default homeSlice.reducer;