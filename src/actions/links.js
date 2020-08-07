import { api } from '../api';
import { createActions } from 'redux-actions';

export const {
  linksHasErrored,
  linksIsLoading,
  linksFetchDataSuccess,
} = createActions(
  {},
  'LINKS_HAS_ERRORED',
  'LINKS_IS_LOADING',
  'LINKS_FETCH_DATA_SUCCESS'
);

export function linksFetchData(linkId) {
  return dispatch => {
    dispatch(linksIsLoading(true));

    api
      .get('links')
      .then(response => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(linksIsLoading(false));
        return response.data;
      })
      .then(links => dispatch(linksFetchDataSuccess(links)))
      .catch(() => dispatch(linksHasErrored(true)));
  };
}
