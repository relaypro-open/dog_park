export function hostsHasErrored(state = false, action) {
  if (action.type === 'HOSTS_HAS_ERRORED') return action.payload;
  return state;
}

export function hostsIsLoading(state = false, action) {
  if (action.type === 'HOSTS_IS_LOADING') return action.payload;
  return state;
}

export function hosts(state = { hostList: [], hostObjects: {} }, action) {
  if (action.type !== 'HOSTS_FETCH_DATA_SUCCESS') return state;

  const hosts = action.payload.sort((x, y) => {
    if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
    if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
    return 0;
  });

  let hostsObject = {};
  hosts.forEach((h) => {
    if (
      !h.name.includes('.phonebooth.net') &&
      !h.name.includes('.phoneboothdev.info')
    ) {
      if (h.name.includes('-qa-')) {
        h.name = h.name + '.phoneboothdev.info';
      } else if (h.name.includes('-pro-')) {
        h.name = h.name + '.phonebooth.net';
      }
    }
    hostsObject[h.id] = h;
  });

  return { hostList: hosts, hostObjects: hostsObject };
}
