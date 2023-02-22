import * as React from 'react';
import { useState, useContext, createContext } from 'react';
import { useFetch, ParkInfo, ParkList } from '../hooks/useFetch';
import { InputContainer } from "./InputContainer";
import { OutputContainer } from "./OutputContainer";
import styles from './styles/Main.module.css'

type OptionsContextType = {
  options?: string[] | [],
  testOptionsList?: string[]
}

type InputValueContextType = {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export const OptionsContext = createContext<OptionsContextType>(
  {} as OptionsContextType)
export const InputValueContext = createContext<InputValueContextType>(
  {} as InputValueContextType)

export const Main = () => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [parkList, setParkList] = useFetch("/api", []);

  const getParkNames = (list: ParkList | (() => Promise<void>)): string[] => {
    const parkNames: string[] = [];
    
      Object.entries(list).map((park) => {
        const [parkName, parkCode] = [park[0], park[1].parkCode]
        parkNames.push(parkName)
      })
    
    return parkNames
  }
  const testOptionsList = getParkNames(parkList);

  return (
    <OptionsContext.Provider value={{testOptionsList}}>
      <InputValueContext.Provider value={{inputValue, setInputValue}}>
        
        <div className={styles["container"]}>
          <InputContainer onSubmit={() => console.log(parkList)}/>
          <OutputContainer />
        </div>
      
      </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}