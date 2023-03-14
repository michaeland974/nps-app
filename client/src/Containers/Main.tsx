import * as React from 'react';
import styles from './styles/Main.module.css'
//Hooks
import { useState, useEffect, createContext } from 'react';
import { useFetch } from '../hooks/useFetch';
//Containers
import { InputContainer } from "./InputContainer";
import { OutputContainer } from "./OutputContainer";

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
  url?: string,
  parkCode?: string,
  releaseDate?: string //or date
  abstract?: string,
  image?: {
    url?: string,
    caption?: string,
    altText?: string
  },
  relatedParks?: Park[]
} 

type OptionsContextType = {
  parkOptions: string[][] | []
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
  const [inputValueCode, setInputValueCode] = useState('recent');
  const [currentPark, setCurrentPark] = useState('')

  const [{ response, 
           parkOptions, 
           handleParkOptions }] = useFetch("/api", [])

  useEffect(() => {
    handleParkOptions(response.data)
  }, [response])

  const getParkCodeFromInput = (options: Array<Array<string>>) => {
      options.findIndex((item) => {
        const parkName = item[0];
        const parkCode = item[1]
      
      if(parkName === inputValue){
        console.log(`test park code => ${parkCode}`)
        console.log(`test park name => ${parkName}`)
        setInputValueCode(parkCode)
        setCurrentPark(parkName)
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

          <OutputContainer inputValueCode={inputValueCode}
                           setInputValueCode={setInputValueCode}
                           currentPark={currentPark} />
        </div>
      
      </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}
