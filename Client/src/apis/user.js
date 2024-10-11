import axios from "../axios";

export const apiRegister = async (payload) => {
    try {
      const response = await axios.post('/user/register', payload, {
        withCredentials: true,
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

export const apiLogin = async (data) => {
    try {
        const response = await axios.post('/user/login', data);
        return response; 
    } catch (error) {
        throw error; 
    }
};

export const apiGoogleLogin = async (data) => {
  try {
      const response = await axios.post('/auth/google-login', data);
      return response; 
  } catch (error) {
      throw error; 
  }
};

export const apiForgotPassword = async (data) => {
  try {
      const response = await axios.post('/user/forgotpassword', data);
      return response; 
  } catch (error) {
      throw error; 
  }
};

export const apiResetPassword = async (data) => {
  try {
      const response = await axios.put('/user/resetpassword', data);
      return response; 
  } catch (error) {
      throw error; 
  }
};

export const apiGetCurrent = () => axios({
  url: '/user/current',
  method: 'get'
})




export const apiGetAllUser = (params) => axios({
  url: '/user',
  method: 'get',
  params
})

export const apiGetUserToday = (params) => axios({
  url: '/user/user-today',
  method: 'get',
  params
})

export const apiUpdateUser = (data, uid) => axios({
  url: '/user/' +uid,
  method: 'put',
  data
})

export const apiDeleteUser = (uid) => axios({
  url: '/user/' +uid,
  method: 'delete',
})

export const apiUpdateCurrent = (data) => axios({
  url: '/user/current',
  method: 'put',
  data
})

export const apiUpdateCart = (data) => axios({
  url: '/user/cart',
  method: 'put',
  data
})

export const apiRemoveCart = (pid, color) => axios({
  url: `/user/remove-cart/${pid}/${color}`,
  method: 'delete',
})

export const apiUpdateWishlist = (pid) => axios({
  url: `/user/wishlist/` + pid,
  method: 'put',
})