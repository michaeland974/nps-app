import * as React from "react"
import {MouseEvent, useContext, useState} from "react";
import { OptionsContext, InputValueContext } from './../Containers/Main';
import styles from './styles/InputBar.module.css'

export const InputBar: React.FC = () => {
  const [isOpen, setOpen] = useState(false)
  const {options} = useContext(OptionsContext)
  const {inputValue, setInputValue} = useContext(InputValueContext)

  const onInputBarClick = (e: MouseEvent) => {
    setOpen(prevValue => !prevValue)
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if(inputValue !== ''){
      e.stopPropagation();
      setOpen(true);
    }
  }

  const onOptionSelect = (option:string) => {
   // props.onChange !== undefined && props.onChange(option)
   setInputValue(option)
   setOpen(false);
  }

  const clearInput = (e: MouseEvent) => {
    e.stopPropagation()
    setInputValue("");
    setOpen(true) //Possibly change for better UX
    // tell parent onChange is clear onChange("")
  }

  const toggleClass = (toggleCondition: boolean,
                       defaultName:string, 
                       toggledName: string) => {
    if(toggleCondition){
      return `${styles[defaultName]} ${styles[toggledName]}`
    }
    return styles[defaultName]
  }

  const renderOptions = () => {

  }

  return(
    <div className={styles["container"]}
         onBlur={() => setOpen(false)}>
      
      <div className={styles["bar-container"]}
           onClick={onInputBarClick}>
        
        <input className={styles["bar"]} 
               type="text" 
               placeholder="Look for"
               value={inputValue} 
               onChange={handleInput}/>
        <div className={styles["arrow-container"]}>
          <button className={styles["arrow"]}></button>
        </div> 

        <button className={toggleClass((inputValue===''), "clear-button", "hide")}
                onClick={clearInput}> x 
        </button>
      </div>

        <div className={toggleClass((!isOpen), "dropdown", "hide")}>
          {options?.filter((item:string) => {
            const searchItem = inputValue.toLowerCase();
            // item.value?
            const v = item.toLowerCase();
            return v.startsWith(searchItem)

          }).map((option:string, i:number) => {
            return (<div key={i}
                        className={styles["option"]}
                      //onMouseDown prevents onBlur error
                        onMouseDown={ (e) => {
                          e.preventDefault()
                          onOptionSelect(option)
                        }}>{option}</div>)
          })}
        </div>
    </div>
  );
}





  /* <div>{typeof options === undefined ? "Loading..." : 
        Object.entries(options).map((park, i:number) => {
          const [parkName, parkCode] = [park[0], park[1].parkCode]
         
          return <div key={i}>{`Park Name: ${parkName} | Code: ${parkCode}`}</div>
        })}</div> */
