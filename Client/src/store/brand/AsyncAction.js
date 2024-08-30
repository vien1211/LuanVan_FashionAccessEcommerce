import {createAsyncThunk} from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const fetchBrands = createAsyncThunk('brands/fetchBrands', async (_, { rejectWithValue }) => {
    const response = await apis.apiGetAllBrand();
    if (!response.success) return rejectWithValue(response);
    return response.allbrand;
});
  
export const selectBrands = (state) => state.brands.brands;
export const selectBrandsLoading = (state) => state.brands.loading;
export const selectBrandsError = (state) => state.brands.error;
