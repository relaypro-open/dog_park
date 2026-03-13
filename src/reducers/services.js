export function servicesHasErrored(state = false, action) {
  if (action.type === 'SERVICES_HAS_ERRORED') return action.payload;
  return state;
}

export function servicesIsLoading(state = false, action) {
  if (action.type === 'SERVICES_IS_LOADING') return action.payload;
  return state;
}

export function services(
  state = { serviceList: [], serviceNames: {}, serviceIds: {} },
  action
) {
  if (action.type !== 'SERVICES_FETCH_DATA_SUCCESS') return state;

  action.payload.push({ id: 'any', name: 'any' });
  const services = action.payload.sort((x, y) => {
    if (x.name === 'any') return -1;
    if (y.name === 'any') return 1;
    if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
    if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
    return 0;
  });

  let serviceNames = {};
  let serviceIds = {};
  services.forEach((srv) => {
    serviceNames[srv.name] = srv.id;
    serviceIds[srv.id] = srv.name;
  });

  return { serviceList: services, serviceNames, serviceIds };
}
