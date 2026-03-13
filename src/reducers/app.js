export function selectedTab(state = 0, action) {
  if (action.type === 'HANDLE_SELECTED_TAB') return action.payload;
  return state;
}
