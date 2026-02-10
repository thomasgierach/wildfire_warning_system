export async function retrieveBounds(pool, search_term, google_address) {
    console.log("In retrieveBounds");
    try {
      let query = "SELECT * FROM maps_lookup WHERE 0=0 AND search_term = $1;";
      let values = [search_term];
      
      let res = await pool.query(query, values);
      console.log("Bounds retrieved!");
      console.log("Row count:", res.rowCount);
      if (res.rowCount === 0) {
        query = "SELECT * FROM invalid_address_lookup WHERE search_term = $1;";
        res = await pool.query(query,values);
      }
      //console.log("Rows:", res.rows);
      return res;
      
    } catch (error) {
      console.error("Error getting bounds:", error);
    }
  };