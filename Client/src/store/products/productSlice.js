import { createSlice } from '@reduxjs/toolkit';
import * as actions from './AsyncActions';

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [], // Thêm state để lưu danh sách tất cả sản phẩm
    isLoading: false,
    errorMessage: '',
  },
  reducers: {
    // Các reducers khác nếu có
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getNewProducts.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });
    
    builder.addCase(actions.getNewProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.newProducts = action.payload;
    });

    builder.addCase(actions.getNewProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });

    // Xử lý getAllProducts
    builder.addCase(actions.getAllProducts.pending, (state) => {
      state.isLoading = true;
      state.errorMessage = null;
    });

    builder.addCase(actions.getAllProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    });

    builder.addCase(actions.getAllProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.errorMessage = action.payload.message;
    });
  },
});

export default productSlice.reducer;
