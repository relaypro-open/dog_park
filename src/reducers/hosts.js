import { handleAction } from 'redux-actions';

export const hostsHasErrored = handleAction(
  'HOSTS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const hostsIsLoading = handleAction(
  'HOSTS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const hosts = handleAction(
  'HOSTS_FETCH_DATA_SUCCESS',
  (state, action) => {
    const hosts = action.payload.sort((x, y) => {
      if(x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()){
        return 1;
      } else {
        return 0;
      }
    });
    return hosts;
  },
  []
);
