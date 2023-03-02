import * as React from 'react';
import { useState, useEffect, createContext } from 'react';
import { InputContainer } from "./InputContainer";
import { OutputContainer } from "./OutputContainer";
import styles from './styles/Main.module.css'

export interface Json extends Object{
  data?: Object[]
}

type Park = {
  parkCode?: string,
  type?: string,
  fullName?: string,
  url?: string
}

export interface Article{
  parkName?: string,
  title?: string,
  releaseDate?: string //or date
  desc?: string,
  image?: {
    url?: string,
    caption?: string,
    altText?: string
  },
  relatedParks?: Park[]
} 

type OptionsContextType = {
  parkData?: string[][] | [],
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
  
  const [inputValue, setInputValue] = useState('');
  const [inputValueCode, setInputValueCode] = useState('');
  const [parkData, setParkData] = useState<Array<Array<string>>>([])

  useEffect(() => {
    (async () => {
      const keys: Array<Array<string>> = [];
      const response = await fetch("/api");
      const parkList: Promise<{[parkName: string]: Park}> = (await response.json())
      
      Object.entries(parkList).map((park, i) => {
        const [parkName, parkCode] = [park[0], park[1].parkCode]
        keys.push([parkName, parkCode])
      })
      setParkData(keys)
    })()
  }, [])

  const getParkCodeFromInput = (options: Array<Array<string>>) => {
      options.findIndex((item) => {
        const parkName = item[0];
        const parkCode = item[1]
      
      if(parkName === inputValue){
        //console.log(parkCode)
        setInputValueCode(parkCode)
        //useEffect
      }
    })
  }

  return (
    <OptionsContext.Provider value={{parkData}}>
      <InputValueContext.Provider value={{inputValue, setInputValue}}>
        
        <div className={styles["container"]}>
          <InputContainer onSubmit={() => {
            getParkCodeFromInput(parkData)
          }}/>

          <OutputContainer />
        </div>
      
      </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}
