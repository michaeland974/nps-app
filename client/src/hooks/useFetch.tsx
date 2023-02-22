import React, {useEffect, useState} from "react";

export type ParkInfo = {
    parkCode: string;
    type: string;
}

/**
 * export type ParkJSON = {
 *  
 * }
 * 
 */

export type ParkList = {
  [parkName: string]: ParkInfo;
}

export const useFetch = (url: string, 
                        // defaultValue: ParkList, 
                         dependencies: []) => {
  const [data, setData] = useState<ParkList>({})

  const fetchData = async() => {
    const response = await fetch(url);
    setData(await response.json())
  }
  useEffect(() => {fetchData()}, dependencies)
  
  return [data, fetchData];
} 
