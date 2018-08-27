import { handleAction } from 'redux-actions';

export const servicesHasErrored = handleAction(
  'SERVICES_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const servicesIsLoading = handleAction(
  'SERVICES_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const services = handleAction(
  'SERVICES_FETCH_DATA_SUCCESS',
  (state, action) => {
    return action.payload;
  },
  []
);
