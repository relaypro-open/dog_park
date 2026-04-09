import { api, getErrorMessage } from '../api';
import { createAction } from '@reduxjs/toolkit';
import { environmentsFetchData } from './environments';

export const profilesHasErrored = createAction('PROFILES_HAS_ERRORED');
export const profilesIsLoading = createAction('PROFILES_IS_LOADING');
export const profilesFetchDataSuccess = createAction('PROFILES_FETCH_DATA_SUCCESS');

export function profilesFetchData() {
  return (dispatch) => {
    dispatch(profilesIsLoading(true));

    api
      .get('profiles')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(getErrorMessage(response));
        }
        return response.data;
      })
      .then((profiles) => dispatch(profilesFetchDataSuccess(profiles)))
      .then(() => dispatch(environmentsFetchData()))
      .catch((err) => dispatch(profilesHasErrored(err.message || true)));
  };
}
