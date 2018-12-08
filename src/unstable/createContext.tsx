import * as React from "react";
import useContextState from "./useContextState";
import { ContextState } from "./types";
import { parseState } from "./utils";

function warnNoProvider() {
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn(
      "[constate] Have you forgotten to wrap your components with Provider?"
    );
  }
}

function createContext() {
  const Context = React.createContext<ContextState>({
    useState: state => [parseState(undefined, state), warnNoProvider]
  });

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const useState = useContextState();
    const value = React.useMemo(() => ({ useState }), [useState]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { Context, Provider };
}

export default createContext;
