import { api } from '../api';
import { createAction } from '@reduxjs/toolkit';

export const zonesHasErrored = createAction('ZONES_HAS_ERRORED');
export const zonesIsLoading = createAction('ZONES_IS_LOADING');
export const zonesFetchDataSuccess = createAction('ZONES_FETCH_DATA_SUCCESS');

export function zonesFetchData() {
  return (dispatch) => {
    dispatch(zonesIsLoading(true));

    api
      .get('zones')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(zonesIsLoading(false));
        return response.data;
      })
      .then((zones) => dispatch(zonesFetchDataSuccess(zones)))
      .catch(() => dispatch(zonesHasErrored(true)));
  };
}
