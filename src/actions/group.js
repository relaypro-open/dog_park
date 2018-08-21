import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  groupHasErrored,
  groupIsLoading,
  groupFetchDataSuccess,
} = createActions({},
  'GROUP_HAS_ERRORED',
  'GROUP_IS_LOADING',
  'GROUP_FETCH_DATA_SUCCESS',
)

//get group
export function groupFetchData(groupId) {
  return (dispatch) => {
    dispatch(groupIsLoading(true));

    api.get('group/' + groupId )
    .then((response) => {
      if (response.status !== 200) {
        throw Error(response.statusText);
      }
      return response.data;
    })
    .then((group) => {
      dispatch(groupIsLoading(false));
      dispatch(groupFetchDataSuccess(group))
    })
    .catch(() => dispatch(groupHasErrored(true)));

  };
}

/*
export const {
  groupHasErrored,
  groupIsLoading,
  groupFetchDataSuccess,
  editGroupOpen,
  createGroupHasErrored,
  createGroupIsLoading,
  createGroupSuccess,
  updateGroupHasErrored,
  updateGroupIsLoading,
  updateGroupSuccess,
} = createActions({},
  'GROUP_HAS_ERRORED',
  'GROUP_IS_LOADING',
  'GROUP_FETCH_DATA_SUCCESS',
  'EDIT_GROUP_OPEN',
  'CREATE_GROUP_HAS_ERRORED',
  'CREATE_GROUP_IS_LOADING',
  'CREATE_GROUP_SUCCESS',
  'UPDATE_GROUP_HAS_ERRORED',
  'UPDATE_GROUP_IS_LOADING',
  'UPDATE_GROUP_SUCCESS',
)*/

//create a new group
/*export function createGroup(groupName, groupProfileId, groupProfileName) {
  return (dispatch) => {
    dispatch(createGroupIsLoading(true));

    //dispatch(profileFetchData(groupProfileId));

    api.post('group', {
      "name": groupName,
      "profile_id": groupProfileId,
      "profile_name": groupProfileName
    }).then((response) => {
      if (response.status === 201) {
        dispatch(newGroupId(response.url));
      }
      dispatch(createGroupIsLoading(false));
      return response.data;
    })
    .then((group) => dispatch(createGroupSuccess(group)))
    .catch(() => dispatch(createGroupHasErrored(true)));
  };

}*/

//update group
/*export function updateGroup(groupId, groupProfileName) {
  return (dispatch) => {
    dispatch(updateGroupIsLoading(true));

    //dispatch(profileFetchData(groupProfileId));

    api.put('group' + groupId, {
      "profile_id": groupProfileId,
      "profile_name": groupProfileName
    }).then((response) => {
      if (response.status === 201) {
        dispatch(newGroupId(response.url));
      }
      dispatch(updateGroupIsLoading(false));
      return response.data;
    })
    .then((group) => dispatch(updateGroupSuccess(group)))
    .catch(() => dispatch(updateGroupHasErrored(true)));
  };

}*/
