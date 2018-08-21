import { handleAction } from 'redux-actions';

export const selectedTab = handleAction('HANDLE_SELECTED_TAB', (state, action) => {
    return action.payload;
  },
  0
);
