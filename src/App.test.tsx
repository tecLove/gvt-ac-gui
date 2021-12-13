import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import App from "./App";

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders App component to the DOM", () => {
  act(() => {
    render(<App />, container);
  });
  expect(container).toBeTruthy();
});

it("should check value of search box", () => {
  act(() => {
    render(<App></App>, container);
  });
  const input = container.querySelector("[data-testid='search-input-box']");
  expect(input.textContent).toEqual("");
});

it("should check value of search box placeholder", () => {
  act(() => {
    render(<App></App>, container);
  });
  const input = container.querySelector("[data-testid='search-input-box']");
  expect(input.getAttribute("placeholder")).toEqual("Start typing to search");
});
