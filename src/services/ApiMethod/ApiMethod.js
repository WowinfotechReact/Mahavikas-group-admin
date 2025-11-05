
import axios from "axios"; 
import Api from '../../auth-token/AuthToken'

//......................Post Api With Authorization........................................
export const postApiWithAuthenticated = async (url, params) => {
  try {
    const res = await Api.post(url, params);
    if (res?.data?.statusCode === 401) {
      return;
    }
    return res;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear()
      window.location.replace('/login');
    }
    return error;
  }
};

//......................Get List With Authorization....................................

export const getListWithAuthenticated = async (url) => {
  try {
    const res = await Api.get(url);
    if (res.data.statusCode === 401) {
      return;
    }
    return res;
  } catch (error) {
    if (error.status === 401) {
      localStorage.clear()
      window.location.replace('/login');
    }
    return error;
  }
};

export const postApi = async (url, params) => {
  try {
    const res = await axios.post(url, params);
    if (res.data.statusCode === 401) {
      return;
    }
    return res;
  } catch (error) {
    return error;
  }
};
