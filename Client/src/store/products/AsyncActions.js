import {createAsyncThunk} from '@reduxjs/toolkit'
import * as apis from '../../apis'

export const getNewProducts = createAsyncThunk('product/newProducts', async(data, {rejectWithValue}) => {
    const response = await apis.apiGetProducts()
    //console.log(response)
    if(!response.success) return rejectWithValue(response)
    return response.products
})

export const getAllProducts = createAsyncThunk(
  'products/getAllProduct',
  async (queries, { rejectWithValue }) => {
    try {
      const response = await apis.apiGetProducts(queries);
      if (response.success) {
        return response.productData; 
      } else {
        return rejectWithValue(response.error);
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
