import { handleAction } from 'redux-actions';

export const groupsIsLoading = handleAction('GROUPS_IS_LOADING', (state, action) => {
    return action.payload
  },
  false
);
export const groupsHasErrored = handleAction('GROUPS_HAS_ERRORED', (state, action) => {
    return action.payload
  },
  false
);
export const groups = handleAction('GROUPS_FETCH_DATA_SUCCESS', (state, action) => {
    return action.payload
  },
  []
);


/*export const groupsReducer = handleActions(
  {
    'GROUPS_IS_LOADING':
      (state, action) => ({
        groupsIsLoading: action.payload
      }),
    'GROUPS_HAS_ERRORED':
      (state, action) => ({
        groupsHasErrored: action.payload
      }),
    'GROUPS_FETCH_DATA_SUCCESS':
      (state, action) => ({
        groups: action.payload
      })
  },
  {
    groupsIsLoading: false,
    groupsHasErrored: false,
    groups: []
  }
)*/


/*export function groupsHasErrored(state = false, action) {
    switch (action.type) {
        case 'GROUPS_HAS_ERRORED':
            return action.hasErrored;
        default:
            return state;
    }
}

handleAction('GROUPS_IS_LOADING', (state, action) => ({
    isLoading: action.isLoading
  }),
  false
);
export function groupsIsLoading(state = false, action) {
    switch (action.type) {
        case 'GROUPS_IS_LOADING':
            return action.isLoading;
        default:
            return state;
    }
}
export function groups(state = [], action) {
    switch (action.type) {
        case 'GROUPS_FETCH_DATA_SUCCESS':
          return action.groups;
        default:
          return state;
    }
}*/
