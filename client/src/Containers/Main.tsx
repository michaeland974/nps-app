import * as React from 'react';
import { useEffect, useRef, useReducer} from 'react';
import { useFetch } from '../hooks/useFetch';
import { InputContainer } from "./InputContainer";
import { OutputContainer } from "./OutputContainer";
import { InputState } from '../interfaces/interfaces';
import { OptionsContext, OutputContainerContext, InputValueContext } from '../interfaces/contexts';

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
    <OptionsContext.Provider value={{list: state.options}}>
      <InputValueContext.Provider value={{value: inputState.value,
                                          dispatch,
                                          inputBarRef}}>
        <OutputContainerContext.Provider value={{scrollRef, 
                                                 dispatch, 
                                                 view: inputState.view}}>
            <div>
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
