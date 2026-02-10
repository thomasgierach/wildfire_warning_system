import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { distance_options } from "constats";

const SearchForm = () => {
  const [query, setQuery] = useState({
    address: "",
    distance: "50",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
                    const address = searchParams.get("address") || "";
                    const distance = searchParams.get("distance") || "50";
                
                    setQuery({ address, distance });
                  }, [searchParams]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(
      `/results?address=${encodeURIComponent(query.address)}&distance=${encodeURIComponent(query.distance)}`
    );
  };

  return (
    <div className="wrapper">
      <h1>North American Wildfire Warning System</h1>
      <h2>Enter a valid address as you would into Google Maps.</h2>

      <form className="address_search" onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          value={query.address}
          onChange={handleChange}
          placeholder="Enter Address Here..."
          required
        />

        <div>
          <label htmlFor="distance">Choose a Distance:</label>
          <select
            id="distance"
            name="distance"
            value={query.distance}
            onChange={handleChange}
            required
          >
            {Object.entries(distance_options).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchForm;