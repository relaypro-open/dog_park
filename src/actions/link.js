exportfunction createLinkHasErrored(bool) {
  return {
    type: 'CREATE_LINK_HAS_ERRORED',
    hasErrored: bool,
  };
}
export function createLinkIsLoading(bool) {
  return {
    type: 'CREATE_LINK_IS_LOADING',
    isLoading: bool,
  };
}
export function createLinkSuccess(link) {
  return {
    type: 'CREATE_LINK_SUCCESS',
    link,
  };
}
export function setNewLinkId(linkId) {
  return {
    type: 'NEW_LINK_ID',
    linkId,
  };
}
export function createLink(linkName, linkAddresses) {
  return dispatch => {
    dispatch(createLinkIsLoading(true));

    api
      .post('link', {
        name: linkName,
      })
      .then(response => {
        dispatch(setNewLinkId(response.url));
        dispatch(createLinkIsLoading(false));
        return response.data;
      })
      .then(link => dispatch(createLinkSuccess(link)))
      .catch(() => dispatch(createLinkHasErrored(true)));
  };
}
