import { handleAction } from 'redux-actions';

export const zonesHasErrored = handleAction(
  'ZONES_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const zonesIsLoading = handleAction(
  'ZONES_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const zones = handleAction(
  'ZONES_FETCH_DATA_SUCCESS',
  (state, action) => {
    return action.payload;
  },
  []
);
