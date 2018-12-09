import * as React from "react";

function useContextReducer() {
  // Provider's render phase
  const hooksRef = React.useRef<Array<React.RefObject<any>>>([]);
  const [states, setStates] = React.useState<Array<any>>([]);

  const useReducer = React.useCallback(
    <S, A>(
      reducer: React.Reducer<S, A>,
      initialState: S,
      initialAction?: A | null
    ) => {
      // Consumer's render phase
      const ref = React.useRef(null);
      let index = hooksRef.current.indexOf(ref);
      const isFirstRender = index === -1;
      let state = initialState;

      if (isFirstRender) {
        index = hooksRef.current.length;
        hooksRef.current.push(ref);
        if (initialAction) {
          state = reducer(state, initialAction);
        }
      } else {
        state = states[index];
      }

      React.useLayoutEffect(() => {
        if (isFirstRender) {
          setStates(prevStates => [...prevStates, state]);
        }
      }, []);

      const dispatch = React.useCallback(
        (action: A) =>
          setStates(prevStates => [
            ...prevStates.slice(0, index),
            reducer(prevStates[index], action),
            ...prevStates.slice(index + 1)
          ]),
        []
      );

      return [state, dispatch];
    },
    [states]
  ) as typeof React["useReducer"];

  return useReducer;
}

export default useContextReducer;
