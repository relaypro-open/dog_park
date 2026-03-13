import { handleAction } from 'redux-actions';

export const profilesHasErrored = handleAction(
  'PROFILES_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const profilesIsLoading = handleAction(
  'PROFILES_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const profiles = handleAction(
  'PROFILES_FETCH_DATA_SUCCESS',
  (state, action) => {
    let profiles = {};
    let profileIds = {};

    action.payload.map((profile) => {
      let tempProfile = {};
      tempProfile = {
        id: profile.id,
        name: profile.name,
        created: profile.created,
      };

      profileIds[profile.id] = profile.name;

      if (profile.name in profiles) {
        profiles[profile.name].push(tempProfile);
      } else {
        profiles[profile.name] = [tempProfile];
      }
      return true;
    });

    Object.values(profiles).map((profile) => {
      profile.sort((a, b) => {
        let tsA = new Date(a.created);
        let tsB = new Date(b.created);

        if (tsA.getTime() < tsB.getTime()) {
          return 1;
        } else if (tsA.getTime() > tsB.getTime()) {
          return -1;
        } else {
          return 0;
        }
      });
      return true;
    });

    return {
      profileList: profiles,
      profileIds: profileIds,
    };
  },
  {
    profileList: {},
    profileIds: {},
  }
);
