import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { backend_addr } from "./constants";


/**
 * API helper — NOT a React function
 */
export async function alreadyInsertedCheck(coded_address, distance, fetchFn = fetch) {
  const bounds_attr = `coded_address=${encodeURIComponent(coded_address)}&distance=${encodeURIComponent(distance)}`;

  const response = await fetchFn(
    `${backend_addr}get-existing-bounds?${bounds_attr}`
  );

  const data = await response.json();
  if (!response.ok) {
    return { error: data.error || "Unknown error occurred" };
  } else if (data.error) {
    return { error: data.error};
  }

  return { fires: data.fires };
}

/* We use the coded address */
async function runSearch(address_qry, distance) {
  //const address_array = address_qry.split(" ");
  //const coded_address = address_array.join(space_code);

  const result = await alreadyInsertedCheck(
    address_qry,
    distance
  );
  //console.log(result);
  // Handle backend / Google error
  if (result.error) {
    return {
      error: result.error,
    };
  }

  // Fires found
  if (result.fires.length > 0) {
    return {
      message: `There IS a fire within ${distance} miles of ${address_qry}.`,
      fires: result.fires
    };
  }

  // No fires
  return {
    message: `There is NOT a fire within ${distance} miles of ${address_qry}.`,
    fires: []
  };
}

/**
 * React component
 */
const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const address = searchParams.get("address");
  const distance = searchParams.get("distance");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      setLoading(true);

      const response = await runSearch(address, distance);

      if (response.error) {
        setError(response.error);
      } else {
        setResult(response);
      }

      setLoading(false);
    }

    fetchData();
  }, [address, distance]);

  if (loading) return <p>Checking wildfire data…</p>;

  if (error) {
    return (
      <div className="wrapper error">
        <h2>Invalid Address</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="wrapper">
      <h2>Search Result</h2>
      <p>{result.message}</p>

      {result.fires.length > 0 && (
        <p>{result.fires.length} fire(s) detected nearby.</p>
      )}
    </div>
  );
};

export default SearchResult;
