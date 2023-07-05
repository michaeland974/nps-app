import {useEffect, useState, useCallback, useReducer} from "react";
import { Json, Park } from "../Containers/Main";
import { Article } from "../Containers/Main";

interface Payload {
  data?: Promise<Json>
  isLoading: boolean
}

interface ParkState {
  options: string[][],
  newsDisplay: {
    selected: Article[] | [],
    recent: Article[]
  }
}
type ParkStateKeys = keyof ParkState | keyof ParkState['newsDisplay']

const reducer = (state: ParkState, action: {type: ParkStateKeys, 
                                            payload: ParkState}) => {
  switch(action.type){
    case 'options':
      return {
        ...state,
        options: action.payload.options
      }
    case 'selected':
      const {selected} = action.payload.newsDisplay;
      return {
        ...state,
        newsDisplay: {
          ...state.newsDisplay,
          selected: selected
        }
      }
    case 'recent': 
      const {recent} = action.payload.newsDisplay
      return {
        ...state,
        newsDisplay: {
          ...state.newsDisplay,
          recent: recent
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
      recent: []
    }
  });                        
  //const [data, setData] = useState<Promise<Json>>()
  const [contentDisplay, setContentDisplay] = useState<Article[]>([]) 
  const [recentNews, setRecentNews] = useState<Article[]>([])
  const [parkOptions, setParkOptions] = useState<Array<Array<string>>>([])

  const handleParkOptions = async(obj: Promise<Json> | undefined) => {
    const keys: Array<Array<string>> = [];
    const parkList = await obj

    if(parkList !== undefined){
      Object.entries(parkList).map((park, i) => {
        const [parkName, parkCode] = [park[0], park[1].parkCode]
        keys.push([parkName, parkCode])
      })
      // setParkOptions(keys)
      
      dispatch( {type: 'options', 
                 payload: {...state, options: keys}});
    }
  }

  const handleNewsData = useCallback( 
    // async(obj: Promise<Json> | undefined) => {
      async(obj: Promise<Json> | undefined, endpoint: string) => {

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
         setRecentNews(list)
          // dispatch({ type: 'recent', 
          //             payload: {...state, 
          //             newsDisplay: {...state.newsDisplay, recent: list}}
          //           })
         }
         
         setContentDisplay(list)
        // dispatch({ type: 'selected', 
        //             payload: {...state, 
        //               newsDisplay: {...state.newsDisplay, selected: list}}
        //           })
         return list
  }, [])
  
  const fetchData = async() => {
    const response = await fetch(url);
    const json: Promise<Json> = (await response.json())

    setResponse({data: json, isLoading: false})
  }

  useEffect(() => {
    fetchData()

    return () => setResponse((prevState) => {
      return { data: prevState.data,
               isLoading: true }
    })
  }, dependencies)
  
  return [{ response,
            state,
            recentNews,
            contentDisplay, setContentDisplay, 
            //parkOptions,
            handleParkOptions,
            handleNewsData, 
          }];
} 
