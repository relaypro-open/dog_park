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
    const groups = action.payload.groups.sort((x, y) => {
      if(x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()){
        return 1;
      } else {
        return 0;
      }
    });
    if (action.payload.profiles !== {}) {
      groups.map(group => {
        if(action.payload.profiles[group.profile_name] !== undefined) {
          if (
            action.payload.profiles[group.profile_name][0].id !== group.profile_id
          ) {
            group['hasUpdated'] = true;
            group['currentProfileId'] = action.payload.profiles[group.profile_name][0].id;
          } else {
            group['hasUpdated'] = false;
            group['currentProfileId'] = group.profile_id;
          }
        }
        return true;
      });
      return groups;
    }
  },
  []
);
