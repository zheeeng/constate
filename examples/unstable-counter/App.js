import React from "react";
import { unstable_createContext } from "constate";

const {
  useContext: useCounterContext,
  Provider: CounterProvider
} = unstable_createContext();

function useCounter() {
  const { useState } = useCounterContext();
  const [count, setCount] = useState(0);
  const [lol, setLol] = useState(-10);
  const increment = () => {
    setCount(count + 1);
    setLol(lol - 1);
  };
  const decrement = () => setCount(count - 1);
  return { lol, count, increment, decrement };
}

function IncrementButton() {
  const { increment } = useCounter();
  return <button onClick={increment}>+</button>;
}

function DecrementButton() {
  const { decrement } = useCounter();
  return <button onClick={decrement}>-</button>;
}

function Count() {
  const { count, lol } = useCounter();
  return (
    <span>
      {count} {lol}
    </span>
  );
}

function App() {
  return (
    <CounterProvider>
      <DecrementButton />
      <Count />
      <IncrementButton />
    </CounterProvider>
  );
}

export default App;
