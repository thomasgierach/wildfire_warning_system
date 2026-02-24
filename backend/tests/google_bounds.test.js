import { googleBounds } from "../services/google_bounds.js";
import { describe, it, expect, vi } from "vitest";


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
    //console.log(fetch);
    const result = await googleBounds("", "bad address", "fake-key", fetch, false);
    
    expect(result).toEqual(emptyGoogleResponse);
  });

  it("returns bounds for valid address", async () => {
    fetch.mockResolvedValueOnce({
                      json: async () => ({
                        results: [
                          {
                            geometry: {
                              bounds: {
                                northeast: { lat: 32.9422945, lng: -88.8450944 },
                                southwest: { lat: 32.9330313, lng: -88.8512506 }
                              }
                            }
                          }
                        ]
                      })});
      
    const result = await googleBounds("", "Preston, MS", "fake_api_key", fetch, false);
    //console.log("result", result);
      expect(result).toEqual({
        northeast_lat: 32.9422945,
        northeast_lng: -88.8450944,
        southwest_lat: 32.9330313,
        southwest_lng: -88.8512506
      }); 
    });

    
  });
