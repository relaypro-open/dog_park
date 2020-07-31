import { api } from '../api';
import { createActions } from 'redux-actions';
import { profilesIsLoading } from './profiles';
import { environmentsIsLoading } from './environments';

export const {
  groupsIsLoading,
  groupsHasErrored,
  groupsFetchDataSuccess,
} = createActions(
  {
    GROUPS_FETCH_DATA_SUCCESS: (groups, profiles, environments) => {
      return { groups: groups, profiles: profiles, environments: environments};
    },
  },
  'GROUPS_IS_LOADING',
  'GROUPS_HAS_ERRORED',
);

export function groupsFetchData() {
  return (dispatch, getState) => {
    dispatch(groupsIsLoading(true));

    const { profiles, environments } = getState();

    api
      .get('groups')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(profilesIsLoading(false));
        dispatch(environmentsIsLoading(false));
        dispatch(groupsIsLoading(false));
        return response.data;
      })
      .then(groups => dispatch(groupsFetchDataSuccess(groups, profiles, environments)))
      .catch(() => dispatch(groupsHasErrored(true)));
  };
}
