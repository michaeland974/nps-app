import * as React from 'react';
import {useState, useContext} from "react";
import { InputBar } from "../Components/InputBar";
import { InputValueContext } from './Main';
import styles from './styles/InputContainer.module.css'

type Props = {
  onSubmit: React.MouseEventHandler<HTMLButtonElement>
}

export const InputContainer: React.FC<Props> = ({onSubmit}) => {
  const [isOpen, setOpen] = useState(false)
  const {inputValue, setInputValue} = useContext(InputValueContext)

  return (
    <div className={styles["container"]}>
      Input 
      <InputBar isOpen={isOpen} 
                setOpen={setOpen}
                 />
      <button className="submit"
              onClick={onSubmit}>Submit</button>
    </div>
  )
}