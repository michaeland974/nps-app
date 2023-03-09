import {useEffect, useState, useCallback} from "react";
import { Json, Park } from "../Containers/Main";
import { Article } from "../Containers/Main";

interface dataObj {
  data?: Promise<Json>
  isLoading: boolean
}

export const useFetch = (url: string, 
                         dependencies: [] | [string]) => {
  const [response, setResponse] = useState<dataObj>({ isLoading: true })                          
  const [data, setData] = useState<Promise<Json>>()
  //const [isLoading, setLoading] = useState(false);
  const [contentDisplay, setContentDisplay] = useState<Article[]>([])
  const [parkOptions, setParkOptions] = useState<Array<Array<string>>>([])

  const handleParkOptions = async(obj: Promise<Json> | undefined) => {
    const keys: Array<Array<string>> = [];
    const parkList = await obj

    if(parkList !== undefined){
      Object.entries(parkList).map((park, i) => {
        const [parkName, parkCode] = [park[0], park[1].parkCode]
        keys.push([parkName, parkCode])
      })
      setParkOptions(keys)
    }
  }

  const handleNewsData = useCallback( 
    async(obj: Promise<Json> | undefined) => {
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
         setContentDisplay(list)
         return list
  }, [])

  const handleNewsDataByPark = useCallback(
    async(obj: Promise<Json> | undefined) => {
        const data: Article[] | undefined = (await obj)?.data
        
        if(data !== undefined){
          try{
            setContentDisplay(data)
          }
          catch(error){
            if (error instanceof Error) {
              return {
                message: error.message,
              };
            }
          }
        }
        //return data;
  }, [])
  
  const fetchData = async() => {
    const response = await fetch(url);
    const json: Promise<Json> = (await response.json())

    setData(json)
    setResponse({ data: json, 
                  isLoading: false})
   // return json
  }

  useEffect(() => {
    fetchData()

    return () => setResponse({...data, isLoading: true})
  }, dependencies)
  
  return [{ response,
            contentDisplay, setContentDisplay, 
            parkOptions,
            handleParkOptions,
            handleNewsData, 
          }];
} 
