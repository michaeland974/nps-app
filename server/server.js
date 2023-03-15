import express from 'express'
import cors from 'cors'
import {getParkData, getParkCodes, apiReq} from './scripts/actions.js'

const app = express();
app.use(cors())
app.set("json spaces", 4)

const endpoints = async() => {
    const parkCodes = await getParkCodes();
    parkCodes.forEach((code) => {
    const endpointUrl = `https://developer.nps.gov/api/v1/newsreleases?parkCode=${code}`
    
        app.get(`/api/${code}`, async (req, res, next) => {
            const response = await apiReq(endpointUrl)
            res.json(response)
        })
    })
}

app.get("/api", async (req, res, next) => {
    const parkData = await getParkData();
    res.json(parkData)
    endpoints();
}) 

app.get("/api/recent", async (req, res, next) => {    
    const url = new URL("", "https://developer.nps.gov/api/v1/newsreleases?")
          url.searchParams.set("limit", 150)
    const response = await apiReq(url);
    const data = response.data
    const parkCodes = await getParkCodes();

    /** API request to /api/v1/newsreleases responds with
     *  historical sites, national monuments, recreational areas etc...
     * 
     *  Filters response to only return newsreleases for National Parks
     */ 
    const filtered = data.filter((np) => {
        return parkCodes.includes(np.parkCode.toUpperCase())
    })
    res.json({total: filtered.length, 
              data: filtered})
}) 

app.listen(5000, () => {
    console.log("Server started on port 5000")
})