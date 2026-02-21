import { describe, it, expect, vi } from "vitest";
import { parseCSV } from "../parse_csv.js";  
import { getNasaData } from "../services/get_nasa_bounds.js";


global.fetch = vi.fn();

describe("parseCSV", () => {
    it("returns an empty array for empty CSV string", () => {
        const csvString = ""; // what parseCSV expects
        const result = parseCSV(csvString);
        expect(result).toEqual([]); // or "" if parseCSV returns string for empty
    });
    
    it("parses a simple CSV correctly", () => {
        const csvString = "lat,lng\n36.5,-119.7\n36.6,-119.8";
        const result = parseCSV(csvString);
        console.log("result", result);
        expect(result).toEqual([
        { lat: "36.5", lng: "-119.7" },
        { lat: "36.6", lng: "-119.8" },
        ]);
    });
});

describe("getNasaData", () => {
    it("returns an empty array when no fires are found", async () => {
        fetch.mockResolvedValueOnce({
            text: async () => "lat,lng\n" // CSV with only headers, no data
        });
        
        const result = await getNasaData("0", "0", "1", "1", 1, "fake-api-key", fetch);
        expect(result).toEqual([]);
    });
    
    it("returns fire data when fires are found", async () => {
        const csvData = "latitude,longitude\n32.2863,-89.7225";
        fetch.mockResolvedValueOnce({
            text: async () => csvData
        });
        
        const result = await getNasaData("0", "0", "1", "1", 1, "fake-api-key", fetch);
        console.log("result", result);
        expect(result).toEqual([
            { latitude: "32.2863", longitude: "-89.7225" },
        ]);
    });
});
