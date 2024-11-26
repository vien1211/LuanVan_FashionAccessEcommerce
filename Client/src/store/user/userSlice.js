// import { createSlice } from "@reduxjs/toolkit";
// import * as actions from "./asyncActions";


// export const userSlice = createSlice({
//   name: "user",
//   initialState: {
//     isLoggedIn: false,
//     current: null,
//     token: null,
//     isLoading: false,
//     currentCart: [],
//   },
//   reducers: {
//     login: (state, action) => {
//       // const { isLoggedIn, token } = action.payload;
//       state.isLoggedIn = action.payload.isLoggedIn;
//       state.token = action.payload.token;
//     },
//     logout: (state, action) => {
//       state.isLoggedIn = false
//       state.current = null
//       state.token = null
//       state.isLoading = false
     
//     },
//     updateCart: (state, action) => {
//       const {pid, quantity, color} = action.payload
//       const updatingCart = JSON.parse(JSON.stringify(state.currentCart))
     
//       state.currentCart = updatingCart.map(el =>{
//         if( el.color === color && el.product?._id === pid) {
//           return {...el, quantity}
//         } else return el
//       })
      
      
//     }
//   },
//   extraReducers: (builder) => {
//     builder.addCase(actions.getCurrentUser.pending, (state) => {
//       state.isLoading = true;
 
//     });

//     builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
//       state.isLoading = false;
//       state.current = action.payload;
//       state.currentCart = action.payload.cart
//     });

//     builder.addCase(actions.getCurrentUser.rejected, (state, action) => {
//       state.isLoading = false;
//       state.current = null;
      
      
//     });
//   },
// });

// // Export actions
// export const { login, logout, updateCart } = userSlice.actions;

// // Export reducer
// export default userSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
    role: null, // Thêm trường role vào state
    isLoading: false,
    currentCart: [],
  },
  reducers: {
    login: (state, action) => {
      const { isLoggedIn, token, role } = action.payload; // Lấy role từ action.payload
      state.isLoggedIn = isLoggedIn;
      state.token = token;
      state.role = role; // Lưu role vào state
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.current = null;
      state.token = null;
      state.role = null; // Xóa role khi logout
      state.isLoading = false;
    },
    updateCart: (state, action) => {
      const { pid, quantity, color } = action.payload;
      const updatingCart = JSON.parse(JSON.stringify(state.currentCart));

      state.currentCart = updatingCart.map((el) => {
        if (el.color === color && el.product?._id === pid) {
          return { ...el, quantity };
        } else return el;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actions.getCurrentUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.current = action.payload;
      state.role = action.payload.role; // Lưu role từ payload vào state
      state.currentCart = action.payload.cart;
    });

    builder.addCase(actions.getCurrentUser.rejected, (state) => {
      state.isLoading = false;
      state.current = null;
      state.role = null; // Reset role khi lỗi
    });
  },
});

// Export actions
export const { login, logout, updateCart } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
