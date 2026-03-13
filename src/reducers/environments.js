export function environmentsHasErrored(state = false, action) {
  if (action.type === 'ENVIRONMENTS_HAS_ERRORED') return action.payload;
  return state;
}

export function environmentsIsLoading(state = false, action) {
  if (action.type === 'ENVIRONMENTS_IS_LOADING') return action.payload;
  return state;
}

export function environmentAdd(state = {}, action) {
  if (action.type !== 'ENVIRONMENT_ADDED') return state;

  const environment = action.payload;
  let newEnvironments = Object.assign({}, state);
  let groupsObject = { groupList: [], groupNames: {}, groupIds: {} };
  let zonesObject = { zoneList: [], zoneNames: {}, zoneIds: {} };

  newEnvironments[environment.name] = {};

  const groups = Object.keys(environment.v4.groups).sort((x, y) => {
    if (x.toLowerCase() < y.toLowerCase()) return -1;
    if (x.toLowerCase() > y.toLowerCase()) return 1;
    return 0;
  });
  const zones = Object.keys(environment.v4.zones).sort((x, y) => {
    if (x.toLowerCase() < y.toLowerCase()) return -1;
    if (x.toLowerCase() > y.toLowerCase()) return 1;
    return 0;
  });

  let groupObject = {};
  let zoneObject = {};

  groupsObject['groupList'] = groups.map((group) => {
    groupObject[group] = group;
    return { id: group, name: group };
  });
  zonesObject['zoneList'] = zones.map((zone) => {
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
}

export function environments(state = [], action) {
  if (action.type !== 'ENVIRONMENTS_FETCH_DATA_SUCCESS') return state;

  return action.payload.sort((x, y) => {
    if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
    if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
    return 0;
  });
}
