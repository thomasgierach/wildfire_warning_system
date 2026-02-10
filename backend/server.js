import express from 'express';
import cors from "cors";
// Import PostgreSQL connection
import pool from "./db.js"; 
// Calls postgres db to see if our address already exists
import { retrieveBounds } from "./retrieve_bounds_qry.js";
// Calls Google Maps API
import { googleBounds } from "./google_bounds.js";
// Calls Nasa Wildfire Satellite API
import { getNasaData } from "./get_nasa_bounds.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({path:__dirname + '/.env'});

const app = express();
app.use(express.json());

const port = 8080;

app.get('/', (req, res) => {
  res.send('Welcome to CORS server');
})


app.use(cors());

app.listen(port, () => {
  console.log('listening on port 8080');
})

// ✅ Enable CORS for your frontend
/*
var corsOptions = {
  origin: "*", // Allow all origins
  methods: "GET,POST,PUT,DELETE", // Allow these HTTP methods
  allowedHeaders: "Content-Type,Authorization", 
  exposedHeaders: 'Authorization',  // Expose the Authorization header
};
*/
/*
app.setHeader("Access-Control-Allow-Origin", "*");
app.setHeader("Access-Control-Allow-Credentials", "true");
app.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
app.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
*/
/*
app.use(cors(corsOptions));
 */

app.get('/cors', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.send({ "msg": "This has CORS enabled" });
})
/*
app.post("/api/save-bounds", async (req, res) => {
  console.log("In app.post");
  try {
    const { url_var, google_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng } = req.body;
    if (checkResult.rows.length === 0) {
      console.log("It didn't exist. Adding.");
      await saveBounds(pool, url_var, google_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng);
      res.json({ message: "Bounds saved successfully!" });
    }
    
  } catch (error) {
    res.status(500).json({ error: "Failed to save bounds" });
  }
})
*/
app.get("/api/get-existing-bounds", async (req, res) => {
  console.log("get-existing-bounds");

  try {
    const coded_address = req.query.coded_address;
    
    const checkResult = await retrieveBounds(pool, coded_address, "");
    console.log(checkResult);
    let northeast_lat = "";
    let northeast_lng = "";
    let southwest_lat = "";
    let southwest_lng = "";

    if (checkResult.rows.length !== 0) {
      if (checkResult.rows[0]["northeast_lat"]) {
        northeast_lat = encodeURI(checkResult.rows[0]["northeast_lat"]);
        northeast_lng = encodeURI(checkResult.rows[0]["northeast_lng"]);
        southwest_lat = encodeURI(checkResult.rows[0]["southwest_lat"]);
        southwest_lng = encodeURI(checkResult.rows[0]["southwest_lng"]);
      } 
    } else {
      console.log("Googling Address to Coordinates");
      const apiKey = process.env.GOOGLE_API_KEY;
      
      let response = await googleBounds(coded_address, apiKey);
      northeast_lat = encodeURI(response["northeast_lat"]);
      northeast_lng = encodeURI(response["northeast_lng"]);
      southwest_lat = encodeURI(response["southwest_lat"]);
      southwest_lng = encodeURI(response["southwest_lng"]);
      //console.log("google response");
      //console.log(response);
      
    }
    
    console.log("northeast_lat",northeast_lat)
    console.log("northeast_lng",northeast_lng)
    console.log("southwest_lat",southwest_lat)
    console.log("southwest_lng",southwest_lng)
    
    if (
      (northeast_lat === "" || northeast_lng === "" || southwest_lat === "" || southwest_lng === "") || 
      (northeast_lat === NaN || northeast_lng === NaN || southwest_lat === NaN || southwest_lng === NaN)
    ) {
      const error_msg = `Google Maps did not return results for address: ${coded_address}.`;
      return res.json({ "error":  error_msg});
    }
      
      const distance = req.query.distance;
      //console.log("southwest_lng",distance)
      const fires = await getNasaData(southwest_lng,southwest_lat,northeast_lng,northeast_lat,distance);
      //return_data = await response.text();
      console.log("fires", fires);
      
      
    
    return res.json({ fires, "error" : "" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve bounds" });
  }
})

app.listen(port, () => console.log("Server running on port 8080"))


