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
    let groupsObject = { groupList: [], groupNames: {}, groupIds: {} };
    let zonesObject = { zoneList: [], zoneNames: {}, zoneIds: {} };

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

    groupsObject['groupList'] = groups.map(group => {
      groupObject[group] = group;
      return { id: group, name: group };
    });

    zonesObject['zoneList'] = zones.map(zone => {
      zoneObject[zone] = zone;
      return { id: zone, name: zone };
    });

    groupsObject['groupNames'] = groupObject;
    groupsObject['groupIds'] = groupObject;

    zonesObject['zoneNames'] = zoneObject;
    zonesObject['zoneIds'] = zoneObject;

    newEnvironments[environment.name]['groups'] = groupsObject;
    newEnvironments[environment.name]['zones'] = zonesObject;

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
