import * as React from "react";

function inputsDidChange(
  prev?: React.InputIdentityList,
  next?: React.InputIdentityList
) {
  if (typeof prev === "undefined" || typeof next === "undefined") {
    return true;
  }
  for (const i in next) {
    if (prev[i] !== next[i]) {
      return true;
    }
  }
  return false;
}

function useContextEffect(type: "useEffect" | "useLayoutEffect" = "useEffect") {
  // Provider's render phase
  const hooksRef = React.useRef<Array<React.RefObject<any>>>([]);
  const prevInputs = React.useRef<Array<React.InputIdentityList | undefined>>(
    []
  );
  const effects = React.useRef<
    Array<[React.EffectCallback, React.InputIdentityList | undefined]>
  >([]);

  React[type](() => {
    const cleanups: Array<() => void> = [];
    const { length } = effects.current;

    for (let i = 0; i < length; i += 1) {
      const [effect, inputs] = effects.current[i];
      if (
        inputsDidChange(prevInputs.current[i], inputs) &&
        typeof effect === "function"
      ) {
        const cleanup = effect();
        if (typeof cleanup === "function") {
          cleanups.push(cleanup);
        }
      }
      prevInputs.current[i] = inputs;
    }

    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  });

  const useEffect = React.useCallback(
    (effect: React.EffectCallback, inputs?: React.InputIdentityList) => {
      // Consumer's render phase
      const ref = React.useRef(null);
      let index = hooksRef.current.indexOf(ref);

      // not first render
      if (index >= 0) return;

      index = hooksRef.current.length;
      hooksRef.current.push(ref);
      effects.current.push([effect, inputs]);
    },
    []
  ) as typeof React["useEffect"];

  return useEffect;
}

export default useContextEffect;
