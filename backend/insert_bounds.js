export async function saveBounds(pool, url_var, google_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng) {
  console.log("In saveBounds", Date.now());
  
  try {
    await pool.query(
      "INSERT INTO maps_lookup (search_term, google_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (search_term) DO NOTHING;",
      [url_var, google_address, northeast_lat, northeast_lng, southwest_lat, southwest_lng]
    )
    console.log("Bounds saved!");
    return true;
  } catch (error) {
    console.error("Error saving bounds:", error);
    return false;
  }
};

export async function saveBadAddress(pool, search_term) {
  console.log("In saveBadAddress.");
  try {
    await pool.query(
      "INSERT INTO invalid_address_lookup (search_term) VALUES ($1) ON CONFLICT (search_term) DO NOTHING;",
      [search_term]
    )
    return true;
  } catch (error) {
    console.error("Error inserting bad_address into invalid_address_lookup.");
    return false;
  }
};
