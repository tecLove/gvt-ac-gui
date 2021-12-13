import React from "react";
import Suggestion from "./Suggestion";
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

describe("should verify component render with empty opions being passed", () => {
  it("should render component successfully with data", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    act(() => {
      render(
        <Suggestion
          results={[{ id: 1, description: "description" }]}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    expect(container).toBeTruthy();
  });

  it("should render component successfully and return empty string", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    act(() => {
      render(
        <Suggestion
          results={[]}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    expect(container.textContent).toEqual("");
  });
});
describe("should verify component's render with passed in available options", () => {
  it("should render text of the single available option", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    act(() => {
      render(
        <Suggestion
          results={[{ id: 1, description: "description" }]}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    expect(container.textContent).toEqual("description");
  });

  it("should render text of the multiple available options", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    act(() => {
      render(
        <Suggestion
          results={[
            { id: 1, description: "description1" },
            { id: 2, description: " description2" },
          ]}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    expect(container.textContent).toEqual("description1 description2");
  });
  it("should not render text of the option(s) when wrong key is passed", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    act(() => {
      render(
        <Suggestion
          results={[
            { id: 1, description: "description1" },
            { id: 2, description: " description2" },
          ]}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"_description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    expect(container.textContent).toEqual("");
  });
});

describe("should verify various event on component render", () => {
  it("should verify onClick event", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    const result = [{ id: 1, description: "description" }];
    act(() => {
      render(
        <Suggestion
          results={result}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    const firstOption = document.querySelector("[data-testid=result-1]");
    expect(firstOption?.innerHTML).toBe("description");
    act(() => {
      firstOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(container.textContent).toEqual("description");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should verify onHover event", () => {
    const onClick = jest.fn();
    const onHover = jest.fn();
    const result = [{ id: 1, description: "description" }];
    act(() => {
      render(
        <Suggestion
          results={result}
          onClick={onClick}
          onHover={onHover}
          maxResults={10}
          resultObjectKey={"description"}
          cursor={0}
          handleListRef={undefined}
        />,
        container
      );
    });
    const firstOption = document.querySelector("[data-testid=result-1]");
    expect(firstOption?.innerHTML).toBe("description");
    act(() => {
      firstOption?.dispatchEvent(
        new MouseEvent("mouseover", { bubbles: true })
      );
    });
    expect(container).toBeTruthy();
    expect(onHover).toHaveBeenCalledTimes(1);
  });
});
