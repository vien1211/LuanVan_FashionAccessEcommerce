import {createAsyncThunk} from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const fetchSuppliers = createAsyncThunk('suppliers/fetchSuppliers', async (_, { rejectWithValue }) => {
    const response = await apis.apiGetSuppliers();
    if (!response.success) return rejectWithValue(response);
    return response.suppliers;
});
  
