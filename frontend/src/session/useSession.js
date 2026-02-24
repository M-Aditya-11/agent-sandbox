/**
 * useSession.js
 *
 * Public interface to Session Layer.
 * Components interact with session only through this hook.
 */

import { useReducer } from "react";
import {
  sessionReducer,
  initialSessionState,
} from "./session.reducer";

export function useSession() {
  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionState
  );

  // Action wrappers (clean interface)
  const selectAgent = (id) =>
    dispatch({ type: "SELECT_AGENT", payload: id });

  const deselectAgent = (id) =>
    dispatch({ type: "DESELECT_AGENT", payload: id });

  const setRuntimeLoad = (id, load) =>
    dispatch({
      type: "SET_RUNTIME_LOAD",
      payload: { id, load },
    });

  const toggleGovernanceOverride = (id) =>
    dispatch({
      type: "TOGGLE_GOVERNANCE_OVERRIDE",
      payload: id,
    });

  const clearSession = () =>
    dispatch({ type: "CLEAR_SESSION" });

  return {
    state,
    selectAgent,
    deselectAgent,
    setRuntimeLoad,
    toggleGovernanceOverride,
    clearSession,
  };
}