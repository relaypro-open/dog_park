import { api } from '../api';
import { createActions } from 'redux-actions';
import { profilesIsLoading } from './profiles';

export const {
  groupsIsLoading,
  groupsHasErrored,
  groupsFetchDataSuccess,
} = createActions(
  {
    GROUPS_FETCH_DATA_SUCCESS: (groups, profiles) => {
      return { groups: groups, profiles: profiles };
    },
  },
  'GROUPS_IS_LOADING',
  'GROUPS_HAS_ERRORED',
);

export function groupsFetchData() {
  return (dispatch, getState) => {
    dispatch(groupsIsLoading(true));

    const { profiles } = getState();

    api
      .get('groups')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(profilesIsLoading(false));
        dispatch(groupsIsLoading(false));
        return response.data;
      })
      .then(groups => dispatch(groupsFetchDataSuccess(groups, profiles)))
      .catch(() => dispatch(groupsHasErrored(true)));
  };
}
