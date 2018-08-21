import {handleAction, handleActions} from 'redux-actions';


export const groupHasErrored = handleAction('GROUP_HAS_ERRORED', (state, action) => {
    return action.payload;
  },
  false
);
export const groupIsLoading = handleAction('GROUP_IS_LOADING', (state, action) => {
    return action.payload;
  },
  false
);
export const editGroupOpen = handleAction('EDIT_GROUP_OPEN', (state, action) => {
    return action.payload;
  },
  false
);
export const createGroupHasErrored = handleAction('CREATE_GROUP_HAS_ERRORED', (state, action) => {
    return action.payload;
  },
  false
);
export const createGroupIsLoading = handleAction('CREATE_GROUP_IS_LOADING', (state, action) => {
    return action.payload;
  },
  false
);
export const group = handleActions(
  {
    'GROUP_FETCH_DATA_SUCCESS':
    (state, action) => {
      let groupName, groupId, groupProfileId, groupProfileName, groupProfileVersion
      groupName = action.payload.name;
      groupId = action.payload.id;
      groupProfileId = '';
      groupProfileName = '';
      groupProfileVersion = '';

      if ('profile_id' in action.payload) {
        groupProfileId = action.payload.profile_id;
      }
      if ('profile_name' in action.payload) {
        groupProfileName = action.payload.profile_name;
      }
      if ('profile_version' in action.payload) {
        groupProfileVersion = action.payload.profile_version;
      }
      return {
        groupName,
        groupId,
        groupProfileId,
        groupProfileName,
        groupProfileVersion,
      }
    },
    'CREATE_GROUP_SUCCESS':
    (state, action) => {
      return action.payload;
    },
    'UPDATE_GROUP_PROFILE_NAME':
    (state, action) => {

    }
  },
  {
    groupName: '',
    groupId: '',
    groupProfileId: '',
    groupProfileName: '',
    groupProfileVersion: ''
  }
);
