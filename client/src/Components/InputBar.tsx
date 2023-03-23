import * as React from "react"
import {MouseEvent, useContext, useState, useRef, useEffect} from "react";
import { OptionsContext, InputValueContext } from './../Containers/Main';
import styles from './styles/InputBar.module.css'

/** handling park names that are too lengthy
 *  for input bar on mobile screen */
const overflowName = (name: string) => {
  let isShort = (name.length < 24);
  const overflowName = (name.substring(0, 24))+"..."

  return (isShort ? name : overflowName)
}

export const InputBar: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const {parkOptions} = useContext(OptionsContext)
  const {inputValue, setInputValue} = useContext(InputValueContext)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const onInputBarClick = (e: MouseEvent) => {
    setOpen(prevValue => !prevValue)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if(inputValue !== ''){
      e.stopPropagation();
      setOpen(true)
    }
  }

  const onOptionSelect = (option:string) => {
   setInputValue(option)
   setOpen(false);
  }

  const clearInput = (e: MouseEvent) => {
      e.stopPropagation()       
      setOpen(true)
      setInputValue(""); 
      inputRef.current?.focus();//input ref necessary to prevent onblur bug
  }

  const toggleClass = (toggleCondition: boolean,
                       defaultName:string, 
                       toggledName: string) => {
    if(toggleCondition){
      return `${styles[defaultName]} ${styles[toggledName]}`
    }
    return styles[defaultName]
  }

  const renderOptions = (list: string[][] | [] | undefined) => {
  
    const filterOnChange = list?.filter((options: string[]) => {
      const searchItem = inputValue.toLowerCase();
      const listOption = options[0].toLowerCase();
        return listOption.startsWith(searchItem)
    })
    
    return filterOnChange?.map((options: string[], i: number) => {
        const parkName = options[0]
      
        return (
          <li key={i}
               className={styles["option"]}
             //onMouseDown prevents onBlur error
               onMouseDown={(e) => {                    
                //  e.preventDefault()
                  onOptionSelect(parkName) }} >   
            {parkName}
          </li> )
    })
  }
//! ON CHANGE
  return(
    <div className={styles["container"]}
         onBlur={(e) => {
         if(!e.relatedTarget){

           setOpen(false)
         }
         }}
         >
      <div className={styles["bar-container"]}
           onClick={onInputBarClick}>
        
        <input className={styles["bar"]} 
               type="text" 
               ref={inputRef}
               placeholder="Search for park"
              //  value={inputValue} 
               value={overflowName(inputValue)}
               onChange={handleInput}
               tabIndex={1}/>
       <div className={styles["arrow-container"]}
             >
          <button className={styles["arrow"]}
                  onClick={(e) => inputRef.current?.focus()}></button>
        </div> 

      <button className={toggleClass((inputValue===''), "clear-button", "hide")}
             onClick={(e) => clearInput(e) }> x 
       </button>
      </div>

      <ul className={toggleClass((!isOpen), "dropdown", "hide")}>
        {renderOptions(parkOptions)}
      </ul>
    </div>
  );
}

