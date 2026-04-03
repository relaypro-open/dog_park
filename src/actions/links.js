import { api } from '../api';
import { createAction } from '@reduxjs/toolkit';

export const linksHasErrored = createAction('LINKS_HAS_ERRORED');
export const linksIsLoading = createAction('LINKS_IS_LOADING');
export const linksFetchDataSuccess = createAction('LINKS_FETCH_DATA_SUCCESS');

export function linksFetchData() {
  return (dispatch) => {
    dispatch(linksIsLoading(true));

    api
      .get('links')
      .then((response) => {
        if (response.status !== 200) {
          throw Error(response.statusText);
        }
        dispatch(linksIsLoading(false));
        return response.data;
      })
      .then((links) => dispatch(linksFetchDataSuccess(links)))
      .catch(() => dispatch(linksHasErrored(true)));
  };
}
