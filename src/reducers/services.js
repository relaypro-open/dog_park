import { handleAction } from 'redux-actions';

export const servicesHasErrored = handleAction(
  'SERVICES_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const servicesIsLoading = handleAction(
  'SERVICES_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const services = handleAction(
  'SERVICES_FETCH_DATA_SUCCESS',
  (state, action) => {
    const services = action.payload.sort((x, y) => {
      if(x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()){
        return 1;
      } else {
        return 0;
      }
    });

    let serviceNames = {};
    let serviceIds = {};

    services.forEach(srv => {
      serviceNames[srv.name] = srv.id;
      serviceIds[srv.id] = srv.name;
    });

    return [services, serviceNames, serviceIds];
  },
  []
);
