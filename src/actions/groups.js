import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  groupsIsLoading,
  groupsHasErrored,
  groupsFetchDataSuccess,
} = createActions(
  {},
  'GROUPS_IS_LOADING',
  'GROUPS_HAS_ERRORED',
  'GROUPS_FETCH_DATA_SUCCESS'
);

export function groupsFetchData() {
  return dispatch => {
    dispatch(groupsIsLoading(true));

    api
      .get('groups')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(groupsIsLoading(false));
        return response.data;
      })
      .then(groups => dispatch(groupsFetchDataSuccess(groups)))
      .catch(() => dispatch(groupsHasErrored(true)));
  };
}
