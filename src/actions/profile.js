export function createProfileHasErrored(bool) {
    return {
        type: 'CREATE_PROFILE_HAS_ERRORED',
        hasErrored: bool
    };
}
export function createProfileIsLoading(bool) {
    return {
        type: 'CREATE_PROFILE_IS_LOADING',
        isLoading: bool
    };
}
export function createProfileSuccess(profile) {
    return {
        type: 'CREATE_PROFILE_SUCCESS',
        profile
    };
}
export function setNewProfileId(profileId) {
  return {
    type: 'NEW_PROFILE_ID',
    profileId
  }
}
export function createProfile(profileName, profileProfileName) {
  return (dispatch) => {
    dispatch(createProfileIsLoading(true));

    api.post('profile', {
      "name": profileName,
      "profile_name": profileProfileName,
      "profile_version": "1.1"
    }).then((response) => {
      dispatch(setNewProfileId(response.url));
      dispatch(createProfileIsLoading(false));
      return response.data;
    })
    .then((profile) => dispatch(createProfileSuccess(profile)))
    .catch(() => dispatch(createProfileHasErrored(true)));

  };

}
