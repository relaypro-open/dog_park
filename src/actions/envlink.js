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
            id: linkId ,
            connection_type: linkConnectionType,
            link.direction: linkDirection,
            link.enabled: linkEnabled,
            link.connection.api_port: linkApiPort,
            link.connection.host: linkHost,
            link.connection.password: linkPassword,
            linkPort: link.connection.port,
            linkCACertFile: link.connection.ssl_options.cacertfile,
            linkCertFile: link.connection.ssl_options.certfile,
            linkFailIfNoPeerCert: link.connection.ssl_options.fail_if_no_peer_cert,
            linkServerNameIndication: link.connection.ssl_options.server_name_indication,
            linkVerify: link.connection.ssl_options.verify,
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
