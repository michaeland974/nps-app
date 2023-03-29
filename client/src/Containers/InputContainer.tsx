import * as React from 'react';
import styles from './styles/InputContainer.module.css'
import {useRef} from "react";
//Components
import { InputBar } from "../Components/InputBar";

type Props = {
  onSubmit: React.MouseEventHandler<HTMLButtonElement>
}

export const InputContainer: React.FC<Props> = ({onSubmit}) => {
  const submitRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles["container"]}>
        <InputBar />
        <button className={styles["submit"]}
                ref={submitRef}
                tabIndex={2}
                onClick={onSubmit}>Submit</button>
    </div>
  )
}