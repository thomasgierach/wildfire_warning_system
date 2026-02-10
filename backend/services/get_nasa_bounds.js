import fetch from 'node-fetch';
import { parseCSV } from '../parse_csv.js';
import { sources } from '../constants.js';



export async function getNasaData(southwest_lng,southwest_lat,northeast_lng,northeast_lat,distance, nasa_api_key) {
    console.log("getNasaData");
    //console.log(southwest_lng + ',' + southwest_lat + ',' + northeast_lng + ',' + northeast_lat);
    //approximate mile to degree comparison
    const oneMile = 0.0145;
    //radial distance for demo
    //console.log("distance",distance);
    southwest_lng = (parseFloat(southwest_lng) - (oneMile * distance)).toFixed(3);
    southwest_lat = (parseFloat(southwest_lat) - (oneMile * distance)).toFixed(3);
    northeast_lng = (parseFloat(northeast_lng) + (oneMile * distance)).toFixed(3);
    northeast_lat = (parseFloat(northeast_lat) + (oneMile * distance)).toFixed(3);
    
    console.log("northeast_lat",northeast_lat);
    console.log("northeast_lng",northeast_lng);
    console.log("southwest_lat",southwest_lat);
    console.log("southwest_lng",southwest_lng);
    
    const today = encodeURI(getToday());
    const areaStr = southwest_lng + ',' + southwest_lat + ',' + northeast_lng + ',' + northeast_lat;
    const encodedAreaStr = encodeURI(areaStr);
    
    
    let nasa_url;
    let response;
    let data;
    let fires;
    for (let i = 0; i < sources.length; i++) {
      nasa_url = `https://firms.modaps.eosdis.nasa.gov/usfs/api/area/csv/${nasa_api_key}/${sources[i]}/${encodedAreaStr}/1/${today}`;
      response = await fetch(nasa_url);
      data = await response.text();
      console.log(data);
      fires = parseCSV(data);
      //console.log(fires);
      if (Array.isArray(fires)) {
        //console.log(fires);
        //console.log("Found it");
        return fires;
      }
      //console.log("bad");
      //console.log(data);
    }
    
  
    return [];
  }

function getToday() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//export function { getNasaData };
//module.exports = { getNasaData };