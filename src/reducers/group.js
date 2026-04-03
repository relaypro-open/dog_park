export function groupHasErrored(state = false, action) {
  if (action.type === 'GROUP_HAS_ERRORED') return action.payload;
  return state;
}

export function groupIsLoading(state = false, action) {
  if (action.type === 'GROUP_IS_LOADING') return action.payload;
  return state;
}

export function editGroupOpen(state = false, action) {
  if (action.type === 'EDIT_GROUP_OPEN') return action.payload;
  return state;
}

export function createGroupHasErrored(state = false, action) {
  if (action.type === 'CREATE_GROUP_HAS_ERRORED') return action.payload;
  return state;
}

export function createGroupIsLoading(state = false, action) {
  if (action.type === 'CREATE_GROUP_IS_LOADING') return action.payload;
  return state;
}

const groupInitialState = {
  groupName: '',
  groupId: '',
  groupProfileId: '',
  groupProfileName: '',
  groupProfileVersion: '',
};

export function group(state = groupInitialState, action) {
  switch (action.type) {
    case 'GROUP_FETCH_DATA_SUCCESS': {
      let groupName, groupId, groupProfileId, groupProfileName, groupProfileVersion;
      groupName = action.payload.name;
      groupId = action.payload.id;
      groupProfileId = '';
      groupProfileName = '';
      groupProfileVersion = '';
      if ('profile_id' in action.payload) groupProfileId = action.payload.profile_id;
      if ('profile_name' in action.payload) groupProfileName = action.payload.profile_name;
      if ('profile_version' in action.payload) groupProfileVersion = action.payload.profile_version;
      return { groupName, groupId, groupProfileId, groupProfileName, groupProfileVersion };
    }
    case 'CREATE_GROUP_SUCCESS':
      return action.payload;
    case 'UPDATE_GROUP_PROFILE_NAME':
      return state;
    default:
      return state;
  }
}
