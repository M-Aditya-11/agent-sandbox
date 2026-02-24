/**
 * session.reducer.js
 *
 * Layer-3 Runtime Session State
 * --------------------------------
 * Holds mutable runtime state only.
 * Never stores registry agent objects.
 * Stores IDs + runtime flags only.
 */

export const initialSessionState = {
  selectedAgentIds: [],        // selection layer
  runtimeLoadById: {},         // temporary UI load state
  governanceOverrides: {},     // runtime governance toggles
};

export function sessionReducer(state, action) {
  switch (action.type) {
    case "SELECT_AGENT": {
      const id = action.payload;

      if (state.selectedAgentIds.includes(id)) {
        return state;
      }

      return {
        ...state,
        selectedAgentIds: [...state.selectedAgentIds, id],
      };
    }

    case "DESELECT_AGENT": {
      const id = action.payload;

      return {
        ...state,
        selectedAgentIds: state.selectedAgentIds.filter(
          (agentId) => agentId !== id
        ),
      };
    }

    case "SET_RUNTIME_LOAD": {
      const { id, load } = action.payload;

      return {
        ...state,
        runtimeLoadById: {
          ...state.runtimeLoadById,
          [id]: load,
        },
      };
    }

    case "TOGGLE_GOVERNANCE_OVERRIDE": {
      const id = action.payload;

      return {
        ...state,
        governanceOverrides: {
          ...state.governanceOverrides,
          [id]: !state.governanceOverrides[id],
        },
      };
    }

    case "CLEAR_SESSION": {
      return initialSessionState;
    }

    default:
      return state;
  }
}