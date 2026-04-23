export function groupsIsLoading(state = false, action) {
  if (action.type === 'GROUPS_IS_LOADING') return action.payload;
  return state;
}

export function groupsHasErrored(state = false, action) {
  if (action.type === 'GROUPS_HAS_ERRORED') return action.payload;
  return state;
}

export function groups(
  state = { groupList: [], groupNames: {}, groupIds: {} },
  action
) {
  if (action.type !== 'GROUPS_FETCH_DATA_SUCCESS') return state;

  const groups = action.payload.groups.sort((x, y) => {
    if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
    if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
    return 0;
  });

  if (action.payload.profiles && action.payload.profiles.profileList && Object.keys(action.payload.profiles.profileList).length !== 0) {
    groups.map((group) => {
      if (
        action.payload.profiles.profileList[group.profile_name] !== undefined
      ) {
        if (
          action.payload.profiles.profileList[group.profile_name][0].id !==
          group.profile_id
        ) {
          group['hasUpdated'] = true;
          group['currentProfileId'] =
            action.payload.profiles.profileList[group.profile_name][0].id;
        } else {
          group['hasUpdated'] = false;
          group['currentProfileId'] = group.profile_id;
        }
      }
      return true;
    });
  }

  let groupNames = {};
  let groupIds = {};
  groups.forEach((grp) => {
    groupNames[grp.name] = grp.id;
    groupIds[grp.id] = grp.name;
  });

  return { groupList: groups, groupNames, groupIds };
}
