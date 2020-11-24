import { handleAction } from 'redux-actions';

export const zonesHasErrored = handleAction(
  'ZONES_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const zonesIsLoading = handleAction(
  'ZONES_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const zones = handleAction(
  'ZONES_FETCH_DATA_SUCCESS',
  (state, action) => {
    const zones = action.payload.sort((x, y) => {
      if (x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    let zoneIds = {};
    let zoneNames = {};

    zones.forEach((z) => {
      zoneNames[z.name] = z.id;
      zoneIds[z.id] = z.name;
    });

    return { zoneList: zones, zoneNames: zoneNames, zoneIds: zoneIds };
  },
  { zoneList: [], zoneNames: {}, zoneIds: {} }
);
