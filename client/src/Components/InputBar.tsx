import * as React from "react"
import {MouseEvent, useContext, useState, useRef, useEffect} from "react";
import { OptionsContext, InputValueContext, OutputContainerContext } from './../Containers/Main';
import styles from './styles/InputBar.module.css'
import { classMerger } from "../utils/classMerger";
import { overflowText } from "../utils/overflowText";

/** handling park names that are too lengthy
 *  for input bar on mobile screen */
const overflowName = (name: string) => {
  let isShort = (name.length < 24);
  const overflowName = (name.substring(0, 24))+"..."

  return (isShort ? name : overflowName)
}

const overflowName2 = (name: string, overflowValue: number) => {
  let isShort = (name.length < overflowValue);
  const overflowName = (name.substring(0, overflowValue))+"..."

  return (isShort ? name : overflowName)
}

export const InputBar: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const {parkOptions} = useContext(OptionsContext)
  const {inputValue, setInputValue, inputBarRef} = useContext(InputValueContext)
  const {scrollRef} = useContext(OutputContainerContext)

  const handlePointerEvents = (eventRef: React.RefObject<HTMLDivElement>) => {
    const add = () => eventRef && eventRef.current ? 
      eventRef.current.classList.add("no-click") : null;
    const remove = () => eventRef && eventRef.current ? 
      eventRef.current.classList.remove("no-click") : null;
    return {add, remove}
  }

  //disable outer click events when dropdown is open
  useEffect(() => {
    const {add, remove} = handlePointerEvents(scrollRef!)
    isOpen ? add() : remove();
  }, [isOpen])

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
      inputBarRef.current?.focus();//input ref necessary to prevent onblur bug
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
            //onMouseDown prevents onBlur bug
              onMouseDown={(e) => onOptionSelect(parkName) }>   
            {parkName}
          </li> )
    })
  }

  return(
    <div className={styles["container"]}
         onBlur={(e) => {
            if(!e.relatedTarget) setOpen(false)
         }}>
      <div className={styles["bar-container"]}
           onClick={onInputBarClick}>
        
        <input className={styles["bar"]} 
               type="text" 
               ref={inputBarRef}
               placeholder="Search for park"
               value={overflowText(inputValue, 24)}
               onChange={handleInput}
               tabIndex={1}/>
       
        <div className={styles["arrow-container"]}>
            <button className={styles["arrow"]}
                    onClick={(e) => {
                      inputBarRef.current?.focus()
                    }}>    
            </button>
         </div> 

        <button className={classMerger((inputValue===''), styles["clear-button"], 
                                                          styles["hide"])}
                onClick={(e) => clearInput(e) }> x </button>
      </div>

      <ul className={classMerger((!isOpen), styles["dropdown"], 
                                            styles["hide"])}
          data-testid="dropdown-element">
        {renderOptions(parkOptions)}
      </ul>
    </div>
  );
}

