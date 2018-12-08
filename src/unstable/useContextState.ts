import * as React from "react";
import { parseState } from "./utils";
import useInitialState from "./useInitialState";

function useContextState() {
  // Provider's render phase
  const hooksRef = React.useRef<Array<React.RefObject<any>>>([]);
  const [states, setStates] = React.useState<Array<any>>([]);

  const useState = React.useCallback(
    (initialState: any) => {
      // Consumer's render phase
      const ref = React.useRef(null);
      let index = hooksRef.current.indexOf(ref);
      const isFirstRender = index === -1;

      useInitialState(setStates, initialState);

      if (isFirstRender) {
        index = hooksRef.current.length;
        hooksRef.current.push(ref);
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
    },
    [states]
  ) as typeof React["useState"];

  return useState;
}

export default useContextState;
