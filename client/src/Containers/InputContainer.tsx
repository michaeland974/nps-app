import React from "react";
import { InputBar } from "../Components/InputBar";
import { useClickOutside } from "../hooks/useClickOutside";
import { useFetch } from "../hooks/useFetch";

export const InputContainer = () => {
  //pass up props in here, so submit button can read input value of InputBar

  const Comp = useClickOutside(InputBar)

  return (
    <div className="container">
      <Comp />
      <button>Submit</button>
    </div>
  )
}