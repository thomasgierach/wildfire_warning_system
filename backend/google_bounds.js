import { saveBounds, saveBadAddress } from './insert_bounds.js';
import fetch from 'node-fetch';
import pool from './db.js'

export async function googleBounds(coded_address, apiKey) {
    console.log("In googleBounds");
    //console.log("coded_address:", coded_address);
    let northeast_lat = "";
    let northeast_lng = "";
    let southwest_lat = "";
    let southwest_lng = "";
    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${coded_address}&key=${apiKey}`;
    console.log(apiURL);
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        
        let northeast;
        let southwest;
        if (data.results.length > 0) {
            try {
                northeast = data.results[0].geometry.bounds.northeast;
                southwest = data.results[0].geometry.bounds.southwest;
            } catch(error) {
                northeast = data.results[0].geometry.viewport.northeast;
                southwest = data.results[0].geometry.viewport.southwest;
            }
            northeast_lat = northeast.lat;
            northeast_lng = northeast.lng;
            southwest_lat = southwest.lat;
            southwest_lng = southwest.lng;
            await saveBounds(pool, decodeURI(coded_address), data.results[0].formatted_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng);
        } else {
            await saveBadAddress(pool, decodeURI(coded_address));
            throw new Error("No results found.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
    console.log("returning data");
    return {
        northeast_lat,
        northeast_lng,
        southwest_lat,
        southwest_lng
        };
};