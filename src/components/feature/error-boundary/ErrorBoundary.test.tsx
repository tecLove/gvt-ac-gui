import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

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

describe("should render successfully", () => {
  it("should render children passsed in", () => {
    act(() => {
      render(<ErrorBoundary>render children</ErrorBoundary>, container);
    });
    expect(container.textContent).toEqual("render children");
  });
});
