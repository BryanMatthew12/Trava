import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/auth/authSlice';
import destinationSlice from '../slices/destination/destinationSlice';
import placeSlice from '../slices/places/placeSlice';
import threadslice from '../slices/threads/threadSlice';
import itinerarySlice from '../slices/itinerary/itinerarySlice';    
import homeSlice from '../slices/home/homeSlice';
import showItineraryReducer from '../slices/itinerary/showItinerarySlice';

export const store = configureStore({
    reducer: {
        auth : authSlice,
        destinations: destinationSlice,
        places: placeSlice,
        threads: threadslice,
        itineraries: itinerarySlice,
        home: homeSlice,
        showItinerary: showItineraryReducer
    },
})
