export function zonesHasErrored(state = false, action) {
  if (action.type === 'ZONES_HAS_ERRORED') return action.payload;
  return state;
}

export function zonesIsLoading(state = false, action) {
  if (action.type === 'ZONES_IS_LOADING') return action.payload;
  return state;
}

export function zones(
  state = { zoneList: [], zoneNames: {}, zoneIds: {} },
  action
) {
  if (action.type !== 'ZONES_FETCH_DATA_SUCCESS') return state;

  const zones = action.payload.sort((x, y) => {
    if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
    if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
    return 0;
  });

  let zoneIds = {};
  let zoneNames = {};
  zones.forEach((z) => {
    zoneNames[z.name] = z.id;
    zoneIds[z.id] = z.name;
  });

  return { zoneList: zones, zoneNames, zoneIds };
}
