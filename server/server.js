import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import {readFile} from 'fs/promises'

dotenv.config();
const app = express();

const getParkData = async() => {
    const parkData = JSON.parse( await readFile(
        new URL('./park-data.json', import.meta.url)
    ))
    return parkData;
}

const endpoints = async() => {
    const parkData = await getParkData();

    Object.keys(parkData).forEach((np) => {
        app.get(`/api/${parkData[np].parkCode}`, async (req, res, next) => {
            const response = await axios({
                method: "GET",
                url: `https://developer.nps.gov/api/v1/newsreleases?parkCode=${parkData[np].parkCode}`,
                headers: {"X-Api-Key": process.env.APP_API_KEY}
            })
            res.json(response.data)
        })
    })
}

app.set("json spaces", 4)
app.get("/api", async (req, res, next) => {
    const parkData = await getParkData();
    res.json(parkData)
    endpoints();
})   

app.listen(5000, () => {
    console.log("Server started on port 5000")
})