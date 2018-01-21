// The types of actions that you can dispatch to modify the state of the store
export const types = {
    SELECT_OBJECT: 'SELECT_OBJECT',
    DESELECT_OBJECT: 'DESELECT_OBJECT',
    UPDATE_DATA: 'UPDATE_DATA'
};

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
    selectObject: object => {
        return {
            type: types.SELECT_OBJECT,
            payload: object
        };
    },
    deselectObject: () => {
        return {
            type: types.DESELECT_OBJECT,
            payload: undefined
        };
    },
    updateData: data => {
        return {
            type: types.UPDATE_DATA,
            payload: data
        };
    }
};

// Initial state of the store
const initialState = {
    selectedObject: undefined,
    data: {
        nodes: [],
        edges: []
    }
};

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.
export const reducer = (state = initialState, action) => {
    const { selectedObject, data } = state;
    const { type, payload } = action;

    switch (type) {
        case types.SELECT_OBJECT: {
            return {
                ...state,
                selectedObject: payload
            };
        }
        case types.DESELECT_OBJECT: {
            return {
                ...state,
                selectedObject: undefined
            };
        }
        case types.UPDATE_DATA: {
            return {
                ...state,
                data: payload
            };
        }
    }

    return state;
};