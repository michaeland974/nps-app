import * as React from 'react';
import styles from './styles/Main.module.css'
import { useState, useEffect, createContext, useRef, useReducer} from 'react';
import { useFetch } from '../hooks/useFetch';
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

export type DisplayType = 'rows' | 'card'

type InputState = Record<'value' | 'code' | 'view', string>

type OptionsContextType = {
  parkOptions: string[][] | []
}

type InputValueContextType = {
  inputValue: string
  dispatch: React.Dispatch<{type: keyof InputState, payload: string}>
  inputBarRef: React.RefObject<HTMLInputElement>
}


export interface OutputContainerContextType{
  scrollRef?: React.RefObject<HTMLDivElement>
  dispatch: React.Dispatch<{type: keyof InputState, payload: string}>
  displayType: DisplayType | string
}

export const OptionsContext = createContext<OptionsContextType>(
  {} as OptionsContextType)
export const InputValueContext = createContext<InputValueContextType>(
  {} as InputValueContextType)
export const OutputContainerContext = createContext<OutputContainerContextType>(
  {} as OutputContainerContextType)


const reducer = (state: InputState, 
                 action: {type: keyof InputState, payload: string}): InputState => {
  switch(action.type){
    case 'value':
      return{
        ...state, 
        value: action.payload
      }
    case 'code':
      return{
        ...state, 
        code: action.payload
      }
    case 'view':
      return{
        ...state,
        view: action.payload
      }
  }
}

export const Main: React.FC = () => {
  const [inputState, dispatch] = useReducer(reducer, {
    value: '',
    code: 'recent',
    view: 'rows'
  }); 
  const inputBarRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [{response, state,
          handleParkOptions}] = useFetch("/api", [])

  useEffect(() => {
    handleParkOptions(response.data)
  }, [response])

  const getParkCodeFromInput = (options: Array<Array<string>>) => {
      options.findIndex((item) => {
        const parkName = item[0];
        const parkCode = item[1]
      
      if(parkName === inputState.value){
        dispatch({type: 'code', payload: parkCode});
      }
    })
  }

  return (
    <OptionsContext.Provider value={{parkOptions: state.options}}>
    <InputValueContext.Provider value={{inputValue: inputState.value,
                                        dispatch,
                                        inputBarRef}}>
    <OutputContainerContext.Provider value={{scrollRef, 
                                             dispatch, 
                                             displayType: inputState.view, 
                                             }}>
        <div className={styles.container}>
          <InputContainer onSubmit={() => {
            getParkCodeFromInput(state.options);
            dispatch({type: 'view', payload: 'rows'})
          }}/>                           
          <OutputContainer inputValueCode={inputState.code}/>
        </div>
    </OutputContainerContext.Provider>
    </InputValueContext.Provider>
    </OptionsContext.Provider>
    )
}
