import React from "react";
import AutoComplete from "./AutoComplete";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import {
  AUTOCOMPLETE_MAX_RESULTS,
  PLACEHOLDER_TEXT,
  DefaultFuseConfig,
} from "../../../config/autocomplete.config";
import { default as optionsObj } from "../../../data/search-option.json";
import { fireEvent } from "@testing-library/react";

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  jest.useRealTimers();
});

describe("should verify component render", () => {
  it("should render component successfully", () => {
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={[]}
        ></AutoComplete>,
        container
      );
    });
    expect(container).toBeTruthy();
  });

  it("should render component with default search string and no placeholder passed in", () => {
    act(() => {
      render(
        <AutoComplete
          maxResults={AUTOCOMPLETE_MAX_RESULTS}
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          defaultSearchString={"using reactjs"}
          options={[]}
        ></AutoComplete>,
        container
      );
    });
    expect(
      container.querySelector("[data-testid='search-input-box']").value
    ).toEqual("using reactjs");
    expect(
      container
        .querySelector("[data-testid='search-input-box']")
        .getAttribute("placeholder")
    ).toBeNull();
  });

  it("should render component with no default search string and with placeholder string", () => {
    act(() => {
      render(
        <AutoComplete
          maxResults={AUTOCOMPLETE_MAX_RESULTS}
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={[]}
          placeholder={PLACEHOLDER_TEXT}
        ></AutoComplete>,
        container
      );
    });
    expect(
      container.querySelector("[data-testid='search-input-box']").value
    ).toEqual("");
    expect(
      container
        .querySelector("[data-testid='search-input-box']")
        .getAttribute("placeholder")
    ).toEqual("Start typing to search");
  });
});

describe("should verify search", () => {
  it("should return search result with string passed in", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          defaultSearchString={"using reactjs"}
        ></AutoComplete>,
        container
      );
    });
    expect(
      container.querySelector("[data-testid='result-1']").textContent
    ).toEqual(options[0].description);
  });

  it("should select clicked result", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          defaultSearchString={"using reactjs"}
        ></AutoComplete>,
        container
      );
    });
    const firstOption = document.querySelector("[data-testid=result-1]");
    expect(firstOption?.innerHTML).toBe(options[0].description);
    act(() => {
      firstOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
      container.querySelector("[data-testid='search-input-box']").value
    ).toEqual(options[0].description);
  });

  it("should not show any result as search string does not match any available options", () => {
    const options = [{ id: 1, description: "xyzz" }];
    const searchText = "using reactjs";
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          defaultSearchString={searchText}
        ></AutoComplete>,
        container
      );
    });
    const firstOption = document.querySelector("[data-testid=result-1]");
    expect(firstOption?.innerHTML).toBe(undefined);
    act(() => {
      firstOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(
      container.querySelector("[data-testid='search-input-box']").value
    ).toEqual(searchText);
  });
});

describe("should verify call of callbacks", () => {
  it("should call handleOnChange callback method", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    const handleOnChange = jest.fn();
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          defaultSearchString={"using reactjs"}
          onChange={handleOnChange}
        ></AutoComplete>,
        container
      );
    });
    const firstOption = document.querySelector("[data-testid=result-1]");
    act(() => {
      firstOption?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(handleOnChange).toHaveBeenCalled();
  });

  it("should call handleOnFocus callback method", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    const handleOnFocus = jest.fn();
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          autoFocus={true}
          defaultSearchString={"using reactjs"}
          onFocusEvent={handleOnFocus}
        ></AutoComplete>,
        container
      );
    });
    expect(handleOnFocus).toHaveBeenCalledTimes(1);
  });

  it("should call not handleOnFocus callback method when autofocus is false", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    const handleOnFocus = jest.fn();
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          autoFocus={false}
          defaultSearchString={"using reactjs"}
          onFocusEvent={handleOnFocus}
        ></AutoComplete>,
        container
      );
    });
    expect(handleOnFocus).not.toHaveBeenCalled();
  });

  it("should call onClear callback method", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    const handleOnClear = jest.fn();
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          autoFocus={false}
          defaultSearchString={"using ReactJS"}
          onClear={handleOnClear}
        ></AutoComplete>,
        container
      );
    });
    const input = container.querySelector("[data-testid='search-input-box']");
    act(() => {
      jest.advanceTimersByTime(300);
    });
    fireEvent.change(input, { target: { value: "" } });
    expect(handleOnClear).toHaveBeenCalled();
  });

  it("should call handleOnTextChange callback method", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    const handleOnTextChange = jest.fn();
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          defaultSearchString={"using reactjs"}
          options={options}
          autoFocus={true}
          onTextChange={handleOnTextChange}
        ></AutoComplete>,
        container
      );
    });

    // move ahead in time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });
    expect(handleOnTextChange).not.toHaveBeenCalled();
  });

  it("should call handleOnTextChange callback method with custom debounce time", () => {
    const options = [{ id: 1, description: "using ReactJS" }];
    const handleOnTextChange = jest.fn();
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          defaultSearchString={"using reactjs"}
          inputDebounceTime={500}
          options={options}
          autoFocus={true}
          onTextChange={handleOnTextChange}
        ></AutoComplete>,
        container
      );
    });

    // move ahead in time by 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(handleOnTextChange).not.toHaveBeenCalled();
  });
});

describe("should verify number of results shown", () => {
  it("should return number of results as the value passed in", () => {
    const options = optionsObj;
    act(() => {
      render(
        <AutoComplete
          maxResults={5}
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          defaultSearchString={"child"}
        ></AutoComplete>,
        container
      );
    });
    expect(
      container.querySelector("[data-testid='result-5']").textContent
    ).toEqual(options[5].description);
    expect(container.querySelector("[data-testid='result-6']")).toEqual(null);
  });

  it("should return number of results as the default value when no explicit value is passed in", () => {
    const options = optionsObj;
    act(() => {
      render(
        <AutoComplete
          fuseConfig={DefaultFuseConfig}
          resultObjectKey={"description"}
          options={options}
          defaultSearchString={"child"}
        ></AutoComplete>,
        container
      );
    });
    expect(container.querySelector("[data-testid='result-7']")).toEqual(null);
  });
});
