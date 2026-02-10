import { getWildfireResult } from "../services/wildfireService";
import badGoogleResponse from "./fixtures/google/geocode_zero_results.json";

jest.mock("../services/google_bounds", () => ({
  googleBounds: jest.fn()
}));

test("returns error for invalid address", async () => {
  googleBounds.mockResolvedValue({ error: "No results found." });

  const result = await getWildfireResult({
    pool: mockPoolReturningNoRows(),
    coded_address: "not a real place",
    distance: 25,
    googleApiKey: "fake"
  });

  expect(result.error).toMatch("did not return results");
});