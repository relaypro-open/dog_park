import { flan_api } from '../flan_api';
import { createActions } from 'redux-actions';
import { hostsIsLoading } from './hosts';

export const {
  flanIpsIsLoading,
  flanIpsHasErrored,
  flanIpsFetchDataSuccess,
} = createActions(
  {
    FLAN_IPS_FETCH_DATA_SUCCESS: (flanIps, hosts) => {
      return { flanIps: flanIps, hosts: hosts};
    },
  },
  'FLAN_IPS_IS_LOADING',
  'FLAN_IPS_HAS_ERRORED',
);

export function flanIpsFetchData() {
  return (dispatch, getState) => {
    dispatch(flanIpsIsLoading(true));

    const { hosts } = getState();

    flan_api
      .get('flan_ips')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(hostsIsLoading(false));
        dispatch(flanIpsIsLoading(false));
        return response.data;
      })
      .then(flanIps => dispatch(flanIpsFetchDataSuccess(flanIps, hosts)))
      .catch(() => dispatch(flanIpsHasErrored(true)));
  };
}
