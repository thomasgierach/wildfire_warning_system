import { describe, it, expect, vi } from "vitest";
import { parseCSV } from "../parse_csv.js";  

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
