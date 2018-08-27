import { handleAction } from 'redux-actions';

export const groupsIsLoading = handleAction(
  'GROUPS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);
export const groupsHasErrored = handleAction(
  'GROUPS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);
export const groups = handleAction(
  'GROUPS_FETCH_DATA_SUCCESS',
  (state, action) => {
    return action.payload;
  },
  []
);
