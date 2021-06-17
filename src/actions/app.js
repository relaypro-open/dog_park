import { createActions } from 'redux-actions';

export const { handleSelectedTab } = createActions({}, 'HANDLE_SELECTED_TAB');
export const { handleSelectedScanLocation } = createActions(
  {},
  'HANDLE_SELECTED_SCAN_LOCATION'
);
