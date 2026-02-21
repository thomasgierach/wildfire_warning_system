import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

import { describe, it, expect } from "vitest";

describe("App component", () => {
  it("renders the wildfire warning system heading", () => {
    render(
      
        <App />
      
    );

    expect(
      screen.getByText(/wildfire warning system/i)
    ).toBeInTheDocument();
  });
});
