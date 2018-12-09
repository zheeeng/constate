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

  const useContext = () => {
    const { consumers, states, setStates } = React.useContext(Context);
    const consumer = React.useRef<Array<React.RefObject<any>>>([]);

    if (consumers.current.indexOf(consumer) === -1) {
      consumers.current.push(consumer);
    }

    const isWorkingConsumer = () => consumers.current[0] === consumer;

    console.log(consumers.current);

    React.useLayoutEffect(
      () => () => {
        const index = consumers.current.indexOf(consumer);
        consumers.current = [
          ...consumers.current.slice(0, index),
          ...consumers.current.slice(index + 1)
        ];
      },
      []
    );

    return {
      useState: (initialState: any) => {
        const hookRef = React.useRef(null);
        let index = consumer.current.indexOf(hookRef);

        React.useLayoutEffect(() => {
          if (isWorkingConsumer()) {
            setStates(prevStates => {
              if (prevStates[index] == null) {
                return [...prevStates, parseState(undefined, initialState)];
              }
              return prevStates;
            });
          }
        }, []);

        const isFirstRender = index === -1;

        if (isFirstRender) {
          index = consumer.current.length;
          consumer.current.push(hookRef);
        }

        if (!isWorkingConsumer()) {
          return [
            states[index],
            (nextState: any) =>
              setStates(prevStates => [
                ...prevStates.slice(0, index),
                parseState(prevStates[index], nextState),
                ...prevStates.slice(index + 1)
              ])
          ];
        }

        const state = isFirstRender ? initialState : states[index];

        const setState = React.useCallback(
          (nextState: any) =>
            setStates(prevStates => [
              ...prevStates.slice(0, index),
              parseState(prevStates[index], nextState),
              ...prevStates.slice(index + 1)
            ]),
          []
        );

        return [state, setState];
      }
    };
  };

  const Provider = ({ children }: { children: React.ReactNode }) => {
    const [states, setStates] = React.useState<Array<any>>([]);
    const consumers = React.useRef<Array<React.RefObject<any>>>([]);

    const value = { consumers, states, setStates };
    // const value = React.useMemo(() => ({ consumers }), []);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { useContext, Provider };
}

export default createContext;
