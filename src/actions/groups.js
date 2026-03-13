import { api } from '../api';
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

    const { profiles, environments } = getState();

    api
      .get('groups')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(profilesIsLoading(false));
        dispatch(environmentsIsLoading(false));
        dispatch(groupsIsLoading(false));
        return response.data;
      })
      .then((groups) =>
        dispatch(groupsFetchDataSuccess(groups, profiles, environments))
      )
      .catch(() => dispatch(groupsHasErrored(true)));
  };
}
