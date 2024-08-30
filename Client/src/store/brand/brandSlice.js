// src/store/brandSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { fetchBrands } from './AsyncAction';

const brandSlice = createSlice({
  name: 'brands',
  initialState: {
    brands: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectBrands = (state) => state.brands.brands;
export const selectBrandsLoading = (state) => state.brands.loading;
export const selectBrandsError = (state) => state.brands.error;

export default brandSlice.reducer;
