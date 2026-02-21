import express from 'express';
import cors from "cors";
// Import PostgreSQL connection
import pool from "./db/db.js"; 
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { get_wildfire_data } from './services/get_wildfire_data.js';

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

app.get("/api/get-existing-bounds", async (req, res) => {
  try {
    const result = await get_wildfire_data(
      pool,
      req.query.coded_address,
      req.query.distance,
      process.env.GOOGLE_API_KEY,
      process.env.NASA_API_KEY
    );

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to retrieve bounds" });
  }

})

app.listen(port, () => console.log("Server running on port 8080"))


