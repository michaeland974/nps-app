import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import {readFile} from 'fs/promises'

dotenv.config();
const app = express();

const getParkCodes = async() => {
    const parkCodes = [];
    const parkData = JSON.parse( await readFile(
        new URL('./park-data.json', import.meta.url)
    ))
    for (const park in parkData){
        parkCodes.push(parkData[park].parkCode)
    }
    return parkCodes;
}

const endpoints = async() => {
    const parkCodes = await getParkCodes();

    parkCodes.forEach((code) => {
        app.get(`/api/${code}`, async (req, res, next) => {
            const response = await axios({
                method: "GET",
                url: `https://developer.nps.gov/api/v1/newsreleases?parkCode=${code}`,
                headers: {"X-Api-Key": process.env.APP_API_KEY}
            })
            res.json(response.data)
        })
    })
}

app.get("/api", async (req, res, next) => {
    const parkCodes = await getParkCodes();
    res.json(parkCodes)
    endpoints();
})   

app.set("json spaces", 4)

app.listen(5000, () => {
    console.log("Server started on port 5000")
})