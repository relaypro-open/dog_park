import { handleAction } from 'redux-actions';

export const environmentsHasErrored = handleAction(
  'ENVIRONMENTS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const environmentsIsLoading = handleAction(
  'ENVIRONMENTS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const environmentAdd = handleAction(
  'ENVIRONMENT_ADDED',
  (state, action) => {
    const environment = action.payload;
    let newEnvironments = {};
    let groupsList = [];
    let zonesList = [];

    if (
      state !== undefined &&
      Object.keys(state).length !== 0 &&
      state.constructor === Object
    ) {
      newEnvironments = Object.assign({}, state);
    }

    newEnvironments[environment.name] = {};

    const groups = Object.keys(environment.v4.groups).sort((x, y) => {
      if (x.toLowerCase() < y.toLowerCase()) {
        return -1;
      } else if (x.toLowerCase() > y.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    const zones = Object.keys(environment.v4.zones).sort((x, y) => {
      if (x.toLowerCase() < y.toLowerCase()) {
        return -1;
      } else if (x.toLowerCase() > y.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    let groupObject = {};
    let zoneObject = {};

    groupsList[0] = groups.map((group) => {
      groupObject[group] = group;
      return { id: group, name: group };
    });

    zonesList[0] = zones.map((zone) => {
      zoneObject[zone] = zone;
      return { id: zone, name: zone };
    });

    groupsList[1] = groupObject;
    groupsList[2] = groupObject;

    zonesList[1] = zoneObject;
    zonesList[2] = zoneObject;

    newEnvironments[environment.name]['groups'] = groupsList;
    newEnvironments[environment.name]['zones'] = zonesList;

    return newEnvironments;
  },
  {}
);

export const environments = handleAction(
  'ENVIRONMENTS_FETCH_DATA_SUCCESS',
  (state, action) => {
    let newEnvironments = [];

    newEnvironments = action.payload.sort((x, y) => {
      if (x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    return newEnvironments;
  },
  []
);
