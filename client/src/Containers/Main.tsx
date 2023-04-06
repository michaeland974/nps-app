import * as React from 'react';
import styles from './styles/Main.module.css'
//Hooks
import { useState, useEffect, createContext, useRef } from 'react';
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
  releaseDate?: string 
  abstract?: string,
  image?: {
    url?: string,
    caption?: string,
    altText?: string
  },
  relatedParks?: Park[]
} 

type DisplayType = {
  type: 'rows' | 'card'
  //setDisplayType: React.Dispatch<React.SetStateAction<'rows' | 'card'>>
}

type OptionsContextType = {
  parkOptions: string[][] | []
}

type InputValueContextType = {
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  inputBarRef: React.RefObject<HTMLInputElement>
}

type OutputContainerContextType = {
  scrollRef: React.RefObject<HTMLDivElement>
  displayType: {type : 'rows' | 'card'}
  setDisplayType: React.Dispatch<React.SetStateAction<DisplayType>>
}

// type DisplayTypeContextType = {
//   displayType: 'rows' | 'card'
//   setDisplayType: React.Dispatch<React.SetStateAction<displayType>>
// }

export const OptionsContext = createContext<OptionsContextType>(
  {} as OptionsContextType)
export const InputValueContext = createContext<InputValueContextType>(
  {} as InputValueContextType)
export const OutputContainerContext = createContext<OutputContainerContextType>(
  {} as OutputContainerContextType)

export const Main: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputValueCode, setInputValueCode] = useState('recent');
  const [currentPark, setCurrentPark] = useState('')
  const inputBarRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [displayType, setDisplayType] = useState<DisplayType>({type: 'rows'});

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
        setInputValueCode(parkCode)
        setCurrentPark(parkName)
      }
    })
  }

  return (
    <OptionsContext.Provider value={{parkOptions}}>
    <InputValueContext.Provider value={{inputValue, 
                                        setInputValue, 
                                        inputBarRef}}>
    <OutputContainerContext.Provider value={{scrollRef, 
                                             displayType, 
                                             setDisplayType}}>
        <div className={styles.container}>
          <InputContainer onSubmit={() => {
            getParkCodeFromInput(parkOptions)
            setDisplayType({type: 'rows'})
          }}/>

          <OutputContainer inputValueCode={inputValueCode}
                           setInputValueCode={setInputValueCode}
                           currentPark={currentPark} />
        </div>
    </OutputContainerContext.Provider>
    </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}
