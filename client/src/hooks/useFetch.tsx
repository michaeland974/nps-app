import {useEffect, useState, useCallback, useMemo} from "react";
import { Json } from "../Containers/Main";
import { Article } from "../Containers/Main";

export const useFetch = (url: string, dependencies: []) => {
  const [data2, setData] = useState<Promise<Json>>()
  const [articleDisplay, setArticleDisplay] = useState<Article[]>([])

  const handleParkNamesData = (obj: Json) => {}

  //use callback
  const handleArticleData = useCallback( 
    async(obj: Promise<Json> | undefined) => {
       const data: Article[] | undefined = (await obj)?.data
       let list: Article[] | undefined = [];
 
         if(typeof data !== undefined && data?.length !== 0){
          try{
            list = data!.slice(0, 25);
          } catch(error){ }
         } 
         console.log("from handle aritcle data")
         setArticleDisplay(list)
         return list
        }, [])
  
  const fetchData = async(controller: AbortController | null) => {
    const response = await fetch(url, {
      signal: controller?.signal
    });
    const json: Promise<Json> = (await response.json())

    setData(json)
    controller = null
    console.log("from fetch data")
    return json
  }

  useEffect(() => {
    let controller = new AbortController()

    fetchData(controller)
    handleArticleData(data2)

    return () => controller.abort()
  }, dependencies)

//   useEffect(() => {
//     handleArticleData(data2)

//     //return () => setLoading(false)
//  }, [])
  
  return [{ data2, fetchData, 
            articleDisplay, setArticleDisplay, 
            handleArticleData, handleParkNamesData
          }];
} 

// const response = await fetch("/api/recent");
//       const json: Promise<Json> = (await response.json())
//       const data: Article[] | undefined = (await json).data
