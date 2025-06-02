import { configureStore } from '@reduxjs/toolkit';
import tyresReducer from './slices/tyres/tyresSlice';
import myTyresReducer from './slices/tyres/myTyresSlice';
import tyreReducer from './slices/tyres/tyreSlice';
import userReducer from './slices/user/userSlice';
import profileReducer from './slices/profile/profileSlice';

export const store = configureStore({
  reducer: {
    tyres: tyresReducer,
    tyre: tyreReducer,
    myTyres: myTyresReducer,
    user: userReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
