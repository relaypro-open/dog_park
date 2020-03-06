import { handleAction } from 'redux-actions';

export const hostsHasErrored = handleAction(
  'HOSTS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const hostsIsLoading = handleAction(
  'HOSTS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const hosts = handleAction(
  'HOSTS_FETCH_DATA_SUCCESS',
  (state, action) => {
    const hosts = action.payload.sort((x, y) => {
      if(x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()){
        return 1;
      } else {
        return 0;
      }
    });

    let hostsObject = {};

    hosts.forEach(h => {
      if(!(h.name.includes(".phonebooth.net")) && !(h.name.includes(".phoneboothdev.info"))) {
        if (h.name.includes("-qa-")) {
          h.name = h.name + ".phoneboothdev.info";
        } else {
          h.name = h.name + ".phonebooth.net";
        }
      }
      hostsObject[h.name] = h;
    });
    //added temporarily may be removed
    /*hosts.forEach(h => {
      api
      .get('host/' + h.id)
      .then(response => {
        if (response.status === 200) {
          return response.data;
        } else if (response.status === 404) {
          throw Error(response.statusText);
        } else {
          throw Error(response.statusText);
        }
      })
      .then(host => {
        if ('group' in host) {
          h['group'] = host.group;
        }
      })
      .catch(error => console.log(error));*/

    return [hosts, hostsObject];
  },
  []
);
