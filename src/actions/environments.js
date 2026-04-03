import { api } from '../api';
import { createAction } from '@reduxjs/toolkit';
import { groupsFetchData } from './groups';

export const environmentsIsLoading = createAction('ENVIRONMENTS_IS_LOADING');
export const environmentsHasErrored = createAction('ENVIRONMENTS_HAS_ERRORED');
export const environmentsFetchDataSuccess = createAction('ENVIRONMENTS_FETCH_DATA_SUCCESS');
export const environmentAdded = createAction('ENVIRONMENT_ADDED');

export function environmentsFetchData() {
  return (dispatch) => {
    dispatch(environmentsIsLoading(true));

    api
      .get('externals')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        return response.data;
      })
      .then((environments) => {
        dispatch(environmentsFetchDataSuccess(environments));
        environments.forEach((env) => {
          getEnvironment(env['id'])
            .then((environment) => dispatch(environmentAdded(environment)))
            .catch(() => dispatch(environmentsHasErrored(true)));
        });
        dispatch(groupsFetchData());
        dispatch(environmentsIsLoading(false));
      })
      .catch(() => dispatch(environmentsHasErrored(true)));
  };
}

async function getEnvironment(env) {
  let response = await api.get('external/' + env);
  if (response.status !== 200) {
    throw Error(response.statusText);
  }
  return response.data;
}
