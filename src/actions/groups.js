import { api, getErrorMessage } from '../api';
import { createAction } from '@reduxjs/toolkit';
import { profilesIsLoading } from './profiles';
import { environmentsIsLoading } from './environments';

export const groupsIsLoading = createAction('GROUPS_IS_LOADING');
export const groupsHasErrored = createAction('GROUPS_HAS_ERRORED');
export const groupsFetchDataSuccess = createAction(
  'GROUPS_FETCH_DATA_SUCCESS',
  (groups, profiles, environments) => ({
    payload: { groups, profiles, environments },
  })
);

export function groupsFetchData() {
  return (dispatch, getState) => {
    dispatch(groupsIsLoading(true));

    api
      .get('groups')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(getErrorMessage(response));
        }
        dispatch(profilesIsLoading(false));
        dispatch(environmentsIsLoading(false));
        dispatch(groupsIsLoading(false));
        return response.data;
      })
      .then((groups) => {
        const { profiles, environments } = getState();
        dispatch(groupsFetchDataSuccess(groups, profiles, environments));
      })
      .catch((err) => dispatch(groupsHasErrored(err.message || true)));
  };
}
