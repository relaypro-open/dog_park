import { api } from '../api';
import { createActions } from 'redux-actions';
import { groupsFetchData } from './groups';

export const {
  environmentsIsLoading,
  environmentsHasErrored,
  environmentsFetchDataSuccess,
  environmentAdded,
} = createActions(
  'ENVIRONMENTS_FETCH_DATA_SUCCESS',
  'ENVIRONMENTS_IS_LOADING',
  'ENVIRONMENTS_HAS_ERRORED',
  'ENVIRONMENT_ADDED'
);

export function environmentsFetchData() {
  return (dispatch, getState) => {
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
