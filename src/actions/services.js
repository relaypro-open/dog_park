import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  servicesHasErrored,
  servicesIsLoading,
  servicesFetchDataSuccess,
} = createActions(
  {},
  'SERVICES_HAS_ERRORED',
  'SERVICES_IS_LOADING',
  'SERVICES_FETCH_DATA_SUCCESS'
);
export function servicesFetchData() {
  return dispatch => {
    dispatch(servicesIsLoading(true));

    api
      .get('services')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(servicesIsLoading(false));
        return response.data;
      })
      .then(services => dispatch(servicesFetchDataSuccess(services)))
      .catch(() => dispatch(servicesHasErrored(true)));
  };
}
