import { get_wildfire_data } from "../services/get_wildfire_data.js"
import { googleBounds } from "../services/google_bounds.js";
import { describe, it, expect, vi } from "vitest";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __path_to_env = __dirname + '/../.env';

dotenv.config({path:__path_to_env});
/*const badGoogleResponse = await fetch("./fixtures/google/geocode_zero_results.json")
                                  .then(response => response.json())
                                  .then(jsonData => {
                                        console.log(jsonData); // You can work with your JSON data here
                                    })
                                  .catch(error => {
                                      console.error('Error fetching JSON:', error);
                                  });
*/

const emptyGoogleResponse = {
                        northeast_lat: '',
                        northeast_lng: '',
                        southwest_lat: '',
                        southwest_lng: '',
                      };

global.fetch = vi.fn();
describe("googleBounds", () => {
  it("returns error for invalid address", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        status: "ZERO_RESULTS"
      })
    });

    const result = await googleBounds("bad address", "fake-key");
    
    expect(result).toEqual(emptyGoogleResponse);
  });

  it("returns bounds for valid address", async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
      
          bounds: {
                        northeast: { lat: 32.9422945, lng: -88.8450944 },
                        southwest: { lat: 32.9330313, lng: -88.8512506 }
                      }
        
      })
    });

    const result = await googleBounds("", "Preston, MS", process.env.GOOGLE_API_KEY, false);
    
    expect(result.northeast_lat).toBe(32.9422945);
    expect(result.southwest_lng).toBe(-88.8512506);
  });
});