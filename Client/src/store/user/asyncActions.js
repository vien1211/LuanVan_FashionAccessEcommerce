import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '../../apis';

export const getCurrentUser = createAsyncThunk('user/current', async (_, thunkAPI) => {
    try {
        const response = await apis.apiGetCurrent();
        
        if (!response.success) {
            return thunkAPI.rejectWithValue(response.message || 'Failed to fetch user data');
        }
        

        return response.rs; 
    } catch (error) {
        
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'An error occurred'); 
    }
});




// export const getCurrentUser = createAsyncThunk('user/current', async(data, {rejectWithValue}) => {
//     const response = await apis.apiGetCurrent()
//     if(!response.success) return rejectWithValue(response)
//         return response.rs
// })
