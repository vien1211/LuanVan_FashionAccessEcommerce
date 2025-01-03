import {createSlice} from '@reduxjs/toolkit'
import * as actions from './AsyncAction'

export const appSlice =  createSlice({
    name: 'app',
    initialState: {
        categories: null,
        isLoading: false,
        isShowModal: false,
        modalChildren: null,
        isShowCart: false
        
    },
    reducers: {
        showModal: (state, action) => {
          state.isShowModal = action.payload.isShowModal
          state.modalChildren = action.payload.modalChildren
        },
        showCart: (state) => {
          state.isShowCart = state.isShowCart === false ? true : false
        }
    },

    extraReducers: (builder) => {
        builder.addCase(actions.getAllCategory.pending, (state) => {
          state.isLoading = true;
          state.errorMessage = null;
        });
    
        builder.addCase(actions.getAllCategory.fulfilled, (state, action) => {
          //console.log(action);
          state.isLoading = false;
          state.categories = action.payload;
        });

        builder.addCase(actions.getAllCategory.rejected, (state, action) => {
          state.isLoading = false;
          state.errorMessage = action.error.message;
        });

      
      },
})

 export const { showModal, showCart} = appSlice.actions
export default appSlice.reducer