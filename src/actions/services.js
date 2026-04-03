import { api } from '../api';
import { createAction } from '@reduxjs/toolkit';

export const servicesHasErrored = createAction('SERVICES_HAS_ERRORED');
export const servicesIsLoading = createAction('SERVICES_IS_LOADING');
export const servicesFetchDataSuccess = createAction('SERVICES_FETCH_DATA_SUCCESS');

export function servicesFetchData() {
  return (dispatch) => {
    dispatch(servicesIsLoading(true));

    api
      .get('services')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(servicesIsLoading(false));
        return response.data;
      })
      .then((services) => dispatch(servicesFetchDataSuccess(services)))
      .catch(() => dispatch(servicesHasErrored(true)));
  };
}
