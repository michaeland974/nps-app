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
      console.log(keys)
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
         console.log("from handle recent news data")
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
        console.log("from handle by park data")
        //return data;
  }, [])
  
  const fetchData = async(controller: AbortController | null) => {
    const response = await fetch(url, {
      signal: controller?.signal
    });
    const json: Promise<Json> = (await response.json())

    setData(json)
    setResponse({data: json, 
              isLoading: false})
    controller = null
    console.log("from fetch data")
    //return () => {setLoading(false)}
   // return json
  }

  useEffect(() => {
    let controller = new AbortController()
    fetchData(controller)

    //return () => setLoading(false)
  }, dependencies)
  
  return [{ response,
            contentDisplay, setContentDisplay, 
            parkOptions,
            handleParkOptions,
            handleNewsData, 
          }];
} 
