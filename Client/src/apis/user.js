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