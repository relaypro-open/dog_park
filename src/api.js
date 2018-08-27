import axios from 'axios';

export const api = axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: process.env.REACT_APP_DOG_API_HOST + '/api/',
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  validateStatus: function(status) {
    return status >= 200 && status < 500; // default
  },
});
