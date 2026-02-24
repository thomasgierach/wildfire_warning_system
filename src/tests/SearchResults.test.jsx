import { describe, it, expect } from "vitest";
import { alreadyInsertedCheck } from "../SearchResults.jsx";

global.fetch = vi.fn();

describe("alreadyInsertedCheck", () => {
  it("returns an error when Google Geocoding API fails", async () => {
    fetch.mockResolvedValueOnce({
        json: async () => ({ fires: [], error: "There is an error." }), // Simulate Google API failure
    });

    const result = await alreadyInsertedCheck("invalid address", "10", fetch);
    //console.log(result);
    expect(result.error).toBeDefined();
  });

  it("returns fires when they are found", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({fires: [{ lat: "36.5", lng: "-119.7" }], error: ""}),
      })
      

    const result = await alreadyInsertedCheck("valid address", "10", fetch);
    expect(result.fires.length).toEqual(1);
  });

  it("returns no fires when none are found", async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({fires: [], error: ""}),
      })
      .mockResolvedValueOnce({
        text: async () => "latitude,longitude\n",
      });

    const result = await alreadyInsertedCheck("valid address", "10", fetch);
    expect(result.fires.length).toEqual(0);
  });
});