import {useEffect, useState, useCallback, useReducer} from "react";
import { JSON } from "../interfaces/interfaces";
import { Article, ParkState, ParkStateKeys } from "../interfaces/interfaces";

interface Payload {
  data?: Promise<JSON>
  isLoading: boolean
}
const reducer = (state: ParkState, action: {type: ParkStateKeys, 
                                            payload: ParkState}) => {
  const {selected, recent} = action.payload.newsDisplay
  switch(action.type){
    case 'options':
      return {
        ...state,
        options: action.payload.options
      }
    case 'selected':
      return {
        ...state,
        newsDisplay: {
          ...state.newsDisplay,
          selected: selected,
        }
      }
    case 'recent': 
      return {
        ...state,
        newsDisplay: {
          ...state.newsDisplay,
          recent: recent
        }
      }
    case 'previous': 
      const {previous} = action.payload.newsDisplay
      return {
        ...state,
        newsDisplay: {
          ...state.newsDisplay,
          selected: recent,
          previous: previous
        }
      }
    default: return action.payload;
  }
};

export const useFetch = (url: string, 
                         dependencies: [] | [string]) => {
  const [response, setResponse] = useState<Payload>({ isLoading: true }) 
  const [state, dispatch] = useReducer(reducer, {
    options: [],
    newsDisplay: {
      selected: [],
      recent: [],
      previous: []
    }
  });                        

  const handleParkOptions = async(obj: Promise<JSON> | undefined) => {
    const keys: Array<Array<string>> = [];
    const parkList = await obj

    if(parkList !== undefined){
      Object.entries(parkList).map((park, i) => {
        const [parkName, parkCode] = [park[0], park[1].parkCode]
        keys.push([parkName, parkCode])
      })      
      dispatch( {type: 'options', 
                 payload: {...state, options: keys}});
    }
  }

  const handleNewsData = useCallback(async(obj: Promise<JSON> | undefined, 
                                           endpoint: string) => {
    const data: Article[] | undefined = (await obj)?.data
    let list: Article[] = [];
      if(data !== undefined && data?.length !== 0){
        try{
          list = data!.slice(0, 25);
        } 
        catch(error){
          if (error instanceof Error) {
            return {
              message: error.message,
            };
          }
        }
      }
    if(endpoint === 'recent'){
      dispatch({ type: 'recent', 
                  payload: {...state, 
                  newsDisplay: {...state.newsDisplay, recent: list}}
                })
    }
    dispatch({ type: 'selected', 
                payload: {...state, 
                newsDisplay: {...state.newsDisplay, selected: list}}
              })
    return list
  }, [])
  
  const fetchData = async() => {
    const response = await fetch(url);
    const json: Promise<JSON> = (await response.json())

    setResponse({data: json, isLoading: false})
  }

  useEffect(() => {
    fetchData()
    return () => setResponse((prevState) => {
      return { data: prevState.data,
                isLoading: true }
    })
  }, dependencies)
  
  return [{ response, state, dispatch, 
            handleParkOptions, handleNewsData }];
} 
