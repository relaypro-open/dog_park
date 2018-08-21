export function createZoneHasErrored(bool) {
    return {
        type: 'CREATE_ZONE_HAS_ERRORED',
        hasErrored: bool
    };
}
export function createZoneIsLoading(bool) {
    return {
        type: 'CREATE_ZONE_IS_LOADING',
        isLoading: bool
    };
}
export function createZoneSuccess(zone) {
    return {
        type: 'CREATE_ZONE_SUCCESS',
        zone
    };
}
export function setNewZoneId(zoneId) {
  return {
    type: 'NEW_ZONE_ID',
    zoneId
  }
}
export function createZone(zoneName, zoneAddresses) {
  return (dispatch) => {
    dispatch(createZoneIsLoading(true));

    api.post('zone', {
      "name": zoneName,
      "addresses": zoneAddresses
    }).then((response) => {
      dispatch(setNewZoneId(response.url));
      dispatch(createZoneIsLoading(false));
      return response.data;
    })
    .then((zone) => dispatch(createZoneSuccess(zone)))
    .catch(() => dispatch(createZoneHasErrored(true)));

  };

}
