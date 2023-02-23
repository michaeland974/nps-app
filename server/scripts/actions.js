import axios from 'axios'
import dotenv from 'dotenv'
import {readFile} from 'fs/promises'

dotenv.config();

export const getParkData = async() => {
  const parkData = JSON.parse( await readFile(
      new URL('./../park-data.json', import.meta.url)
  ))
  return parkData;
}

export const getParkCodes = async() => {
  const parkData = await getParkData();
  const parkCodes = [];

  Object.keys(parkData).forEach((np) => {
      const code = parkData[np].parkCode;
      parkCodes.push(code)
  })
  return parkCodes;
}

export const apiReq = async (url) => {
  const response = await axios({
      method: "GET",
      url: url,
      headers: {"X-Api-Key": process.env.APP_API_KEY}  
  })
  return response.data
}

// const {startDate, endDate} = { startDate: "2022-07-26", 
//                                endDate: "2022-07-27" }
// const dateQ = `Date_Released:[${startDate}T00:00:00Z TO ${endDate}T00:00:00Z]`