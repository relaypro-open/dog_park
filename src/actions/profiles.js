import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  profilesHasErrored,
  profilesIsLoading,
  profilesFetchDataSuccess,
} = createActions(
  {},
  'PROFILES_HAS_ERRORED',
  'PROFILES_IS_LOADING',
  'PROFILES_FETCH_DATA_SUCCESS'
);

export function profilesFetchData() {
  return dispatch => {
    dispatch(profilesIsLoading(true));

    api
      .get('profiles')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(profilesIsLoading(false));
        return response.data;
      })
      .then(profiles => dispatch(profilesFetchDataSuccess(profiles)))
      .catch(() => dispatch(profilesHasErrored(true)));
  };
}
