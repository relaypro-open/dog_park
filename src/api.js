import axios from 'axios';

export const api = axios.create({
  //all axios can be used, shown in axios documentation
  baseURL: import.meta.env.VITE_DOG_API_HOST + '/api/',
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  validateStatus: function(status) {
    return status >= 200 && status < 501; // default
  },
});

export const getErrorMessage = (response) => {
  if (response && response.data) {
    if (typeof response.data === 'string') return response.data;
    return JSON.stringify(response.data, null, 2);
  }
  return response && response.statusText ? response.statusText : 'Unknown Error';
};
