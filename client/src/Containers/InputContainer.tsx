import * as React from 'react';
import styles from './styles/InputContainer.module.css'
import {useState, useContext} from "react";
//Components
import { InputBar } from "../Components/InputBar";

type Props = {
  onSubmit: React.MouseEventHandler<HTMLButtonElement>
}

export const InputContainer: React.FC<Props> = ({onSubmit}) => {
 
  return (
    <div className={styles["container"]}>
      Input Container
      <InputBar />
      <button className="submit"
              tabIndex={2}
              onClick={onSubmit}>Submit</button>
    </div>
  )
}