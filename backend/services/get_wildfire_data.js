// Calls postgres db to see if our address already exists
import { retrieveBounds } from "../db/retrieve_bounds_qry.js";
// Calls Google Maps API
import { googleBounds } from "./google_bounds.js";
// Calls Nasa Wildfire Satellite API
import { getNasaData } from "./get_nasa_bounds.js";
import fetch from 'node-fetch';


export async function get_wildfire_data(pool, coded_address, distance, google_api_key, nasa_api_key) {
        
        const checkResult = await retrieveBounds(pool, coded_address);
        //console.log(checkResult);
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
          
          let response = await googleBounds(pool, coded_address, google_api_key, fetch);
          northeast_lat = encodeURI(response["northeast_lat"]);
          northeast_lng = encodeURI(response["northeast_lng"]);
          southwest_lat = encodeURI(response["southwest_lat"]);
          southwest_lng = encodeURI(response["southwest_lng"]);
          //console.log("google response");
          //console.log(response);
          
        }
        
        /*
        console.log("northeast_lat",northeast_lat)
        console.log("northeast_lng",northeast_lng)
        console.log("southwest_lat",southwest_lat)
        console.log("southwest_lng",southwest_lng)
        */
       
        if (
          (northeast_lat === "" || northeast_lng === "" || southwest_lat === "" || southwest_lng === "") || 
          (Number.isNaN(Number(northeast_lat)) || Number.isNaN(Number(northeast_lng)) || Number.isNaN(Number(southwest_lat)) || Number.isNaN(Number(southwest_lng)) )
        ) {
          const error_msg = `Google Maps did not return results for address: ${coded_address}.`;
          return { "error":  error_msg};
        }
        //console.log("southwest_lng",distance)
        const fires = await getNasaData(southwest_lng,southwest_lat,northeast_lng,northeast_lat,distance, nasa_api_key, fetch);
        //return_data = await response.text();
        //console.log("fires", fires);   
        
        return { fires, "error" : "" };
}