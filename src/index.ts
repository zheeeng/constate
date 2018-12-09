import createContext from "./createContext";
import unstable_createContext from "./unstable/createContext";

const {
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextKey,
  useContextEffect,
  useContextLayoutEffect
} = createContext<{ [key: string]: any }>({});

export {
  unstable_createContext,
  createContext,
  Context,
  Provider,
  useContextReducer,
  useContextState,
  useContextKey,
  useContextEffect,
  useContextLayoutEffect
};
