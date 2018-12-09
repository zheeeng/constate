import * as React from "react";
import { parseState } from "./utils";
import useContextState from "./useContextState";
import useContextReducer from "./useContextReducer";
import useContextEffect from "./useContextEffect";

type ContextState = {
  useState: typeof React["useState"];
  useReducer: typeof React["useReducer"];
  useEffect: typeof React["useEffect"];
  useLayoutEffect: typeof React["useLayoutEffect"];
};

function warnNoProvider() {
  if (process.env.NODE_ENV === "development") {
    console.warn("[constate] Missing Provider"); // eslint-disable-line no-console
  }
}

function createContext() {
  const Context = React.createContext<ContextState>({
    useState: state => [parseState(undefined, state), warnNoProvider],
    useReducer: (reducer, initialState, initialAction) => [
      initialAction ? reducer(initialState, initialAction) : initialState,
      warnNoProvider
    ],
    useEffect: warnNoProvider,
    useLayoutEffect: warnNoProvider
  });

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const useState = useContextState();
    const useReducer = useContextReducer();
    const useEffect = useContextEffect("useEffect");
    const useLayoutEffect = useContextEffect("useLayoutEffect");

    const value = React.useMemo(
      () => ({ useState, useReducer, useEffect, useLayoutEffect }),
      [useState, useReducer, useEffect, useLayoutEffect]
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { Context, Provider };
}

export default createContext;
