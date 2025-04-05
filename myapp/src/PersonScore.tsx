import { useEffect, useState, useReducer, useRef, useMemo } from "react";
import { getPerson } from "./getPerson";

//function carrying out expensive calculation
function sillyExpensiveFunction(): number {
  console.log("Executing silly function");
  let sum = 0;
  for (let i = 0; i < 10000; i++) {
    sum += i;
  }
  return sum;
}

type State = {
  name: string | undefined;
  score: number;
  loading: boolean;
};

type Action =
  | {
      type: "initialize";
      name: string;
    }
  | {
      type: "increment";
    }
  | {
      type: "decrement";
    }
  | {
      type: "reset";
    };

export function PersonScore() {
  const [{ name, score, loading }, dispatch] = useReducer(reducer, {
    name: undefined,
    score: 0,
    loading: true,
  });

  const addButtonRef = useRef<HTMLButtonElement>(null);

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case "initialize":
        return { ...state, name: action.name, score: 0, loading: false };
      case "increment":
        return { ...state, score: state.score + 1 };
      case "decrement":
        return { ...state, score: state.score - 1 };
      case "reset":
        return { ...state, score: 0 };
      default:
        return state;
    }
  }

  useEffect(() => {
    getPerson().then((person) => {
      dispatch({ type: "initialize", name: person.name });
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      addButtonRef.current?.focus();
    }
  }, [loading]);

  const expensiveValue = useMemo(() => sillyExpensiveFunction(), []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{name}</h1>
      <p>Score: {score}</p>
      <p>Expensive Value: {expensiveValue}</p>
      <button
        ref={addButtonRef}
        onClick={() => dispatch({ type: "increment" })}
      >
        Add
      </button>
      <button onClick={() => dispatch({ type: "decrement" })}>Subtract</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}
