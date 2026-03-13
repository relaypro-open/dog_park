import { api } from '../api';
import { createAction } from '@reduxjs/toolkit';

export const hostsHasErrored = createAction('HOSTS_HAS_ERRORED');
export const hostsIsLoading = createAction('HOSTS_IS_LOADING');
export const hostsFetchDataSuccess = createAction('HOSTS_FETCH_DATA_SUCCESS');

export function hostsFetchData() {
  return (dispatch) => {
    dispatch(hostsIsLoading(true));

    api
      .get('hosts')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(hostsIsLoading(false));
        return response.data;
      })
      .then((hosts) => dispatch(hostsFetchDataSuccess(hosts)))
      .catch(() => dispatch(hostsHasErrored(true)));
  };
}
