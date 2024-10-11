import { createSlice } from '@reduxjs/toolkit';
import { fetchSuppliers } from './AsyncAction';

const SupplierSlice = createSlice({
  name: 'suppliers',
  initialState: {
    suppliers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectSuppliers = (state) => state.suppliers.suppliers;
export const selectSuppliersLoading = (state) => state.suppliers.loading;
export const selectSuppliersError = (state) => state.suppliers.error;


export default SupplierSlice.reducer;