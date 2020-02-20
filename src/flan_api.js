import axios from 'axios';

export const flan_api = axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: process.env.REACT_APP_DOG_API_HOST + '/flan_api/',
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
