import * as React from 'react';
import { useState, createContext } from 'react';
import { useFetch } from '../hooks/useFetch';
import { InputContainer } from "./InputContainer";
import { OutputContainer } from "./OutputContainer";
import styles from './styles/Main.module.css'

type OptionsContextType = {
  options?: string[] | [],
}

type InputValueContextType = {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export const OptionsContext = createContext<OptionsContextType>(
  {} as OptionsContextType)
export const InputValueContext = createContext<InputValueContextType>(
  {} as InputValueContextType)

export const Main: React.FC = () => {
  
  const getParkNames = (data: Object | (() => Promise<void>)): string[] => {
    const parkNames: string[] = [];
    
    Object.entries(data).map((park) => {
      const [parkName, parkCode] = [park[0], park[1].parkCode]
      parkNames.push(parkName)
    })
    return parkNames
  }

  const [inputValue, setInputValue] = useState('');
  const [parkData, setParkData] = useFetch("/api", []);
  const options = getParkNames(parkData)
  //const [newsData, setNewsData] = useFetch("/api/recent", [])
  const [newsDisplay, setNewsDisplay] = useState([])

  return (
    <OptionsContext.Provider value={{options}}>
      <InputValueContext.Provider value={{inputValue, setInputValue}}>
        
        <div className={styles["container"]}>
          <InputContainer onSubmit={() => console.log(inputValue)}/>
          <OutputContainer />
        </div>
      
      </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}

// export type ParkInfo = {
//   parkCode: string;
//   type: string;
// }

// export type ParkList = {
// [parkName: string]: ParkInfo;
// }