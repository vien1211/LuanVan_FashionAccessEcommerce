import {createAsyncThunk} from '@reduxjs/toolkit'
import * as apis from '../../apis'

  

export const fetchBlogCategories = createAsyncThunk('blogcategory/fetchBlogCategories', async (_, { rejectWithValue }) => {
    const response = await apis.apiGetAllBlogCategory();
    if (!response.success) return rejectWithValue(response);
    return response.blogCate;
});