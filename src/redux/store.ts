import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './coinsSlice';

const store = configureStore({
  reducer: {
    coins: coinsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
