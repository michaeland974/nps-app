import {useEffect, useState} from "react";

export const useFetch = (url: string, 
                         dependencies: []) => {
  const [data, setData] = useState<Object>({})
                          //Change to type Json
  const fetchData = async() => {
    const response = await fetch(url);
    setData(await response.json())
  }
  useEffect(() => {fetchData()}, dependencies)
  
  return [data, fetchData];
} 
