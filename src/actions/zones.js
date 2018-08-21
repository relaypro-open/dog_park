import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  zonesHasErrored,
  zonesIsLoading,
  zonesFetchDataSuccess
} = createActions ({},
  'ZONES_HAS_ERRORED',
  'ZONES_IS_LOADING',
  'ZONES_FETCH_DATA_SUCCESS'
)

export function zonesFetchData(zoneId) {
  return (dispatch) => {
    dispatch(zonesIsLoading(true));

    api.get('zones' )
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
