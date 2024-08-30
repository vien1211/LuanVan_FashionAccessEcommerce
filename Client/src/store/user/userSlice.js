import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    isLoading: false,
  
  },
  reducers: {
    login: (state, action) => {
      // const { isLoggedIn, token } = action.payload;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout: (state, action) => {
      state.isLoggedIn = false
      state.current = null
      state.token = null
      state.isLoading = false
     
    },
    // Định nghĩa thêm các reducers khác nếu cần
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getCurrentUser.pending, (state) => {
      state.isLoading = true;
 
    });

    builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.current = action.payload;
     
    });

    builder.addCase(actions.getCurrentUser.rejected, (state, action) => {
      state.isLoading = false;
      state.current = null;
      
      
    });
  },
});

// Export actions
export const { login, logout } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
