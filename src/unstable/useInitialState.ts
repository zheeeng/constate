import * as React from "react";
import { parseState } from "./utils";

function useInitialState(
  setStates: React.Dispatch<React.SetStateAction<Array<any>>>,
  initialState: any
) {
  React.useLayoutEffect(() => {
    setStates(prevStates => [
      ...prevStates,
      parseState(undefined, initialState)
    ]);
  }, []);
}

export default useInitialState;
