export async function prepareBounds(url_var, google_address, northeast, southwest) {
    const northeast_lat = northeast.lat;
    const northeast_lng = northeast.lng;
    const southwest_lat = southwest.lat;
    const southwest_lng = southwest.lng;
    
    console.log("In prepareBounds");
    try {
     
      const response = await fetch("/api/save-bounds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({ url_var, google_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng }),
      });
  
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.log("Error:" + error);
    }
  
    //getNasaData(southwest_lng,southwest_lat,northeast_lng,northeast_lat);
  }

  //module.exports = { prepareBounds };