export function linksHasErrored(state = false, action) {
  if (action.type === 'LINKS_HAS_ERRORED') return action.payload;
  return state;
}

export function linksIsLoading(state = false, action) {
  if (action.type === 'LINKS_IS_LOADING') return action.payload;
  return state;
}

export function links(
  state = { linkList: [], linkNames: {}, linkIds: {} },
  action
) {
  if (action.type !== 'LINKS_FETCH_DATA_SUCCESS') return state;

  const links = action.payload.sort((x, y) => {
    if (x.name.toLowerCase() < y.name.toLowerCase()) return -1;
    if (x.name.toLowerCase() > y.name.toLowerCase()) return 1;
    return 0;
  });

  let linkIds = {};
  let linkNames = {};
  links.forEach((z) => {
    linkNames[z.name] = z.id;
    linkIds[z.id] = z.name;
  });

  return { linkList: links, linkNames, linkIds };
}
