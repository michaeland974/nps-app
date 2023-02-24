import * as React from 'react';
import {useState, useContext} from "react";
import { InputBar } from "../Components/InputBar";
import styles from './styles/InputContainer.module.css'

type Props = {
  onSubmit: React.MouseEventHandler<HTMLButtonElement>
}

export const InputContainer: React.FC<Props> = ({onSubmit}) => {
 
  return (
    <div className={styles["container"]}>
      Input Container
      <InputBar />
      <button className="submit"
              onClick={onSubmit}>Submit</button>
    </div>
  )
}