import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  groupHasErrored,
  groupIsLoading,
  groupFetchDataSuccess,
} = createActions(
  {},
  'GROUP_HAS_ERRORED',
  'GROUP_IS_LOADING',
  'GROUP_FETCH_DATA_SUCCESS'
);

//get group
export function groupFetchData(groupId) {
  return dispatch => {
    dispatch(groupIsLoading(true));

    api
      .get('group/' + groupId)
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        return response.data;
      })
      .then(group => {
        dispatch(groupIsLoading(false));
        dispatch(groupFetchDataSuccess(group));
      })
      .catch(() => dispatch(groupHasErrored(true)));
  };
}
