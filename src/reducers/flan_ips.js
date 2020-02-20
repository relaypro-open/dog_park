import { handleAction } from 'redux-actions';

export const flanIpsIsLoading = handleAction(
  'FLAN_IPS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);
export const flanIpsHasErrored = handleAction(
  'FLAN_IPS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);
export const flanIps = handleAction(
  'FLAN_IPS_FETCH_DATA_SUCCESS',
  (state, action) => {
    let groups = {};
    //const flanIps = action.payload.flanIps.sort((x, y) => {
    //  if(x.name.toLowerCase() < y.name.toLowerCase()) {
    //    return -1;
    //  } else if (x.name.toLowerCase() > y.name.toLowerCase()){
    //    return 1;
    //  } else {
    //    return 0;
    //  }
    //});
    if (action.payload.hosts[0] !== []) {
      action.payload.hosts[0].forEach(host => {
        let groupHost = {}
        if(action.payload.flanIps[host['name']] !== undefined) {
          groupHost[host['name']] = action.payload.flanIps[host['name']];
        } else {
          groupHost[host['name']] = [];
        }

        if(!(host.group in groups)) {
          groups[host.group] = [groupHost];
        } else {
          groups[host.group].push(groupHost);
        }
      });
      return [action.payload.flanIps, groups];
    }
  },
  []
);
