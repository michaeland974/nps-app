import * as React from 'react';
import { useState, useEffect, createContext } from 'react';
import { useFetch } from '../hooks/useFetch';
import { InputContainer } from "./InputContainer";
import { OutputContainer } from "./OutputContainer";
import styles from './styles/Main.module.css'

export interface Park {
  parkCode?: string,
  type?: string,
  fullName?: string,
  url?: string
}

export interface Json extends Object{
  data?: Object[],
  parkName: Park
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
  parkOptions?: string[][] | []
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

  const [{ data, 
           parkOptions, 
           handleParkOptions }] = useFetch("/api", [])

  useEffect(() => {
    handleParkOptions(data)
  }, [data])

  //useeffect 
    //[] on inputvaluecode change

  const getParkCodeFromInput = (options: Array<Array<string>>) => {
      options.findIndex((item) => {
        const parkName = item[0];
        const parkCode = item[1]
      
      if(parkName === inputValue){
        console.log(parkCode)
        setInputValueCode(parkCode)
        //useEffect
      }
    })
  }

  return (
    <OptionsContext.Provider value={{parkOptions}}>
      <InputValueContext.Provider value={{inputValue, setInputValue}}>
        
        <div className={styles["container"]}>
          <InputContainer onSubmit={() => {
            getParkCodeFromInput(parkOptions)
          }}/>

          <OutputContainer />
        </div>
      
      </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}
