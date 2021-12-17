import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import SearchResult from "./SearchResult";
import searchResult from "../../../data/search-result.json";

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

it("renders SearchResult component to the DOM", () => {
  act(() => {
    render(<SearchResult />, container);
  });
  expect(container).toBeTruthy();
});
