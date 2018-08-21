import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  groupsIsLoading,
  groupsHasErrored,
  groupsFetchDataSuccess
} = createActions({},
  'GROUPS_IS_LOADING',
  'GROUPS_HAS_ERRORED',
  'GROUPS_FETCH_DATA_SUCCESS'
);

export function groupsFetchData() {
  return (dispatch) => {
    dispatch(groupsIsLoading(true));

    api.get('groups')
    .then((response) => {
      if (response.status !== 200) {
        throw Error(response.statusText);
      }
      dispatch(groupsIsLoading(false));
      return response.data;
    })
    .then((groups) => dispatch(groupsFetchDataSuccess(groups)))
    .catch(() => dispatch(groupsHasErrored(true)));
  };
}

/*
groups.map((group) => {
  await dispatch(groupFetchData(group.id));
  const {g} = this.props.store.getState().group;
  if ('profile_name' in g && 'profile_id' in g && 'profile_version' in g)
  group['profile_name'] = g.profile_name;
  group['profile_id'] = g.profile_id;
  group['profile_version'] = g.profile_version;
})
*/

/*export function groupsHasErrored(bool) {
    return {
        type: 'GROUPS_HAS_ERRORED',
        hasErrored: bool
    };
}*/
/*function groupsLoading(bool) {
    return {
        //type: 'GROUPS_IS_LOADING',
        isLoading: bool
    };
}*/
/*export function groupsFetchDataSuccess(groups) {
    return {
        type: 'GROUPS_FETCH_DATA_SUCCESS',
        groups
    };
}*/
/*export function groupsFetchData() {
    return (dispatch) => {
        dispatch(groupsIsLoading(true));

        let newHeaders = new Headers();

        newHeaders.append("Accept", "application/json");

        let myInit = { method: 'GET',
                      credentials: process.env.REACT_APP_DOG_API_CREDENTIALS,
                      headers: newHeaders,
                      mode: 'cors',
                      };

        let myRequest = new Request(process.env.REACT_APP_DOG_API_HOST + '/api/groups', myInit);
        fetch(myRequest)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                dispatch(groupsIsLoading(false));
                return response;
            })
            .then((response) => response.json())
            .then((groups) => dispatch(groupsFetchDataSuccess(groups)))
            .catch(() => dispatch(groupsHasErrored(true)));
    };
}*/
