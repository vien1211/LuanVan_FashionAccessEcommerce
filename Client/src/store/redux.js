import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import appSlice from './app/appSlice';
import brandSlice from './brand/brandSlice';
import productSlice from './products/productSlice';
import storage from 'redux-persist/lib/storage';

import userSlice from './user/userSlice';


const commonConfig = {
  key: 'shop/user',
  storage,
};

const userConfig = {
  ...commonConfig,
  whitelist: ['isLoggedIn', 'token', 'current'], 
};

const persistedUserReducer = persistReducer(userConfig, userSlice);

export const store = configureStore({
  reducer: {
    app: appSlice,
    product: productSlice,
    user: persistedUserReducer, 
    brand: brandSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
