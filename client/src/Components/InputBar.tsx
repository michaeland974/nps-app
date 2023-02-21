import React, {MouseEvent, useState} from "react";
import { useFetch  } from "../hooks/useFetch";
import { Props as InputProps} from "../hooks/useClickOutside";
import styles from './styles/InputBar.module.css'

export const InputBar = React.forwardRef<HTMLElement, InputProps>(
  ({isOpen, setOpen}, ref) => {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useFetch("/api", {}, []);
  const testOpt = ["redfox", "purple", "red"]

  const createOptions = () => {
    //const options = await useFetch;
  }

  const onInputBarClick = (e: MouseEvent) => {
    setOpen(prevValue => !prevValue)
    /*
    * Error Handling: 
    * if user enters invalid input then clicks on input bar, 
    * dropdown will stay hidden */
    if(inputValue !== ''){
       setOpen(true);
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }

  const onOptionSelect = (option:string) => {
   // props.onChange !== undefined && props.onChange(option)
   setInputValue(option)
   setOpen(false);
  }

  const clearInput = (e: MouseEvent) => {
    e.stopPropagation();
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

  return(
    <div className={styles["container"]} 
         ref={ref as React.RefObject<HTMLDivElement>}
         > 
      <div className={styles["bar-container"]}
           onClick={onInputBarClick}
           >
        <input className={styles["bar"]} 
               type="text" 
               placeholder="Look for"
               value={inputValue} 
               onChange={handleInput}
               />
        <div className={styles["arrow-container"]}>
          <button className={styles["arrow"]}></button>
        </div>

        <button className={toggleClass((inputValue===''), "clear-button", "hide")}
                onClick={clearInput}> x </button>

      </div>
        <div className={toggleClass((!isOpen), "dropdown", "hide")}>
          {testOpt.filter((item:string) => {
            const searchItem = inputValue.toLowerCase();
            // item.value?
            const v = item.toLowerCase();
            return v.startsWith(searchItem)

          }).map((option:string, i:number) => {
            return (<div key={i}
                        className={styles["option"]}
                        onClick={() => onOptionSelect(option)}
                    >{option}</div>)
          })
          }
          
        </div>
    </div>
  );
}


);

  /* <div>{typeof options === undefined ? "Loading..." : 
        Object.entries(options).map((park, i:number) => {
          const [parkName, parkCode] = [park[0], park[1].parkCode]
         
          return <div key={i}>{`Park Name: ${parkName} | Code: ${parkCode}`}</div>
        })}</div> */
