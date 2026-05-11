import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders GymStack brand", () => {
  render(<App />);
  const brand = screen.getByRole("link", { name: /Gym\s*Stack/i });
  expect(brand).toBeInTheDocument();
});
