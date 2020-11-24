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

    if (action.payload.hosts.hostList !== []) {
      action.payload.hosts.hostList.forEach((host) => {
        let groupHost = {};
        console.log(action.payload.flanIps);
        if (action.payload.flanIps[host['name']] !== undefined) {
          groupHost[host['name']] = action.payload.flanIps[host['name']];
        } else {
          groupHost[host['name']] = [];
        }

        if (!(host.group in groups)) {
          groups[host.group] = [groupHost];
        } else {
          groups[host.group].push(groupHost);
        }
      });
      return { hosts: action.payload.flanIps, groups: groups };
    }
  },
  { hosts: {}, groups: {} }
);
