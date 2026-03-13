export function profilesHasErrored(state = false, action) {
  if (action.type === 'PROFILES_HAS_ERRORED') return action.payload;
  return state;
}

export function profilesIsLoading(state = false, action) {
  if (action.type === 'PROFILES_IS_LOADING') return action.payload;
  return state;
}

export function profiles(
  state = { profileList: {}, profileIds: {} },
  action
) {
  if (action.type !== 'PROFILES_FETCH_DATA_SUCCESS') return state;

  let profilesMap = {};
  let profileIds = {};

  action.payload.map((profile) => {
    let tempProfile = {
      id: profile.id,
      name: profile.name,
      created: profile.created,
    };

    profileIds[profile.id] = profile.name;

    if (profile.name in profilesMap) {
      profilesMap[profile.name].push(tempProfile);
    } else {
      profilesMap[profile.name] = [tempProfile];
    }
    return true;
  });

  Object.values(profilesMap).map((profile) => {
    profile.sort((a, b) => {
      let tsA = new Date(a.created);
      let tsB = new Date(b.created);
      if (tsA.getTime() < tsB.getTime()) return 1;
      if (tsA.getTime() > tsB.getTime()) return -1;
      return 0;
    });
    return true;
  });

  return { profileList: profilesMap, profileIds };
}
