import { createSlice } from '@reduxjs/toolkit';
import { fetchBlogCategories } from './AsyncAction';

const blogCateSlice = createSlice({
  name: 'blogcategories',
  initialState: {
    blogcategories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.blogcategories = action.payload;
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const selectBlogCategories = (state) => state.blogcategory.blogcategories;
export const selectBlogCategoriesLoading = (state) => state.blogcategory.loading;
export const selectBlogCategoriesError = (state) => state.blogcategory.error;


export default blogCateSlice.reducer;


