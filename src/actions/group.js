import { api } from '../api';
import { createAction } from '@reduxjs/toolkit';

export const groupHasErrored = createAction('GROUP_HAS_ERRORED');
export const groupIsLoading = createAction('GROUP_IS_LOADING');
export const groupFetchDataSuccess = createAction('GROUP_FETCH_DATA_SUCCESS');

export function groupFetchData(groupId) {
  return (dispatch) => {
    dispatch(groupIsLoading(true));

    api
      .get('group/' + groupId)
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        return response.data;
      })
      .then((group) => {
        dispatch(groupIsLoading(false));
        dispatch(groupFetchDataSuccess(group));
      })
      .catch(() => dispatch(groupHasErrored(true)));
  };
}
