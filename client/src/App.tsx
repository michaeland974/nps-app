import { Header } from './Components/Header';
import { useEffect, useRef, useReducer} from 'react';
import { useFetch } from '../src/hooks/useFetch';
import { InputContainer } from "../src/Containers/InputContainer";
import { OutputContainer } from "../src/Containers/OutputContainer";
import { InputState } from '../src/interfaces/interfaces';
import { OptionsContext, OutputContainerContext, 
         InputValueContext } from '../src/interfaces/contexts';
import './global-styles/reset.css'
import './global-styles/App.css';

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

const App = () => {
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
    <div className="App">
      <span className="mobile-header">
        <Header />
      </span>
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
    </div>
  );
}

export default App;
