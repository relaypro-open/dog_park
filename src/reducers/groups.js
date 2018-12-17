import { handleAction } from 'redux-actions';

export const groupsIsLoading = handleAction(
  'GROUPS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);
export const groupsHasErrored = handleAction(
  'GROUPS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);
export const groups = handleAction(
  'GROUPS_FETCH_DATA_SUCCESS',
  (state, action) => {
    if (action.payload.profiles !== {}) {
      action.payload.groups.map(group => {
        if (
          action.payload.profiles[group.profile_name][0].id !== group.profile_id
        ) {
          group['hasUpdated'] = true;
          group['currentProfileId'] = action.payload.profiles[group.profile_name][0].id;
        } else {
          group['hasUpdated'] = false;
          group['currentProfileId'] = group.profile_id;
        }
        return true;
      });
      return action.payload.groups;
    }
  },
  []
);
