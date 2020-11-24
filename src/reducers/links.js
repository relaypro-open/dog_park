import { handleAction } from 'redux-actions';

export const linksHasErrored = handleAction(
  'LINKS_HAS_ERRORED',
  (state, action) => {
    return action.payload;
  },
  false
);

export const linksIsLoading = handleAction(
  'LINKS_IS_LOADING',
  (state, action) => {
    return action.payload;
  },
  false
);

export const links = handleAction(
  'LINKS_FETCH_DATA_SUCCESS',
  (state, action) => {
    const links = action.payload.sort((x, y) => {
      if (x.name.toLowerCase() < y.name.toLowerCase()) {
        return -1;
      } else if (x.name.toLowerCase() > y.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });

    let linkIds = {};
    let linkNames = {};

    links.forEach((z) => {
      linkNames[z.name] = z.id;
      linkIds[z.id] = z.name;
    });

    return { linkList: links, linkNames: linkNames, linkIds: linkIds };
  },
  { linkList: [], linkNames: {}, linkIds: {} }
);
