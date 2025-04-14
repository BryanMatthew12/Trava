import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../slices/auth/authSlice';
import destinationSlice from '../slices/destination/destinationSlice';
import placeSlice from '../slices/places/placeSlice';

export const store = configureStore({
    reducer: {
        auth : authSlice,
        destinations: destinationSlice,
        places: placeSlice,
    },
})
