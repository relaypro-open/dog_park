import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  hostsHasErrored,
  hostsIsLoading,
  hostsFetchDataSuccess
} = createActions({},
  'HOSTS_HAS_ERRORED',
  'HOSTS_IS_LOADING',
  'HOSTS_FETCH_DATA_SUCCESS'
)
export function hostsFetchData() {
  return (dispatch) => {
    dispatch(hostsIsLoading(true));

    api.get('hosts')
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
