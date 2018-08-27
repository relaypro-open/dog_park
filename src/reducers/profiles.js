import { handleAction } from 'redux-actions';
import moment from 'moment';

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

    action.payload.map(profile => {
      let tempProfile = {};
      tempProfile = {
        id: profile.id,
        name: profile.name,
        created: profile.created,
      };
      if (profile.name in profiles) {
        profiles[profile.name].push(tempProfile);
      } else {
        profiles[profile.name] = [tempProfile];
      }
      return true;
    });

    Object.values(profiles).map(profile => {
      profile.sort((a, b) => {
        let tsA = moment(Object.values(a)[0].created);
        let tsB = moment(Object.values(b)[0].created);

        if (tsA.valueOf() < tsB.valueOf()) {
          return 1;
        } else if (tsA.valueOf() > tsB.valueOf()) {
          return -1;
        } else {
          return 0;
        }
      });
      return true;
    });

    return profiles;
  },
  {}
);
