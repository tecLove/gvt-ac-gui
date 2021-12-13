import appStyle from "./App.module.scss";
import AutoComplete from "./components/shared/auto-complete/AutoComplete";
import AppErrorBoundary from "./components/feature/error-boundary/ErrorBoundary";
import {
  AUTOCOMPLETE_MAX_RESULTS,
  AUTOCOMPLETE_AUTO_FOCUS,
  INPUT_DEBOUNCE_TIME,
  PLACEHOLDER_TEXT,
  DefaultFuseConfig,
  AutoCompleteTheme,
} from "./config/autocomplete.config";
import { EndPoints, OptionObj } from "./models/app.model";
import { default as availableOptions } from "./data/search-option.json";
import { useCallback, useEffect, useState } from "react";
import SearchResult from "./components/shared/search-result/SearchResult";

const App = () => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState(availableOptions);
  const [searchResult, setSearchResult] = useState({});

  // const options: Array<OptionObj> = availableOptions;

  /**
   * @param string
   * @param results
   */
  const handleOnTextChange = useCallback(
    (searchText: string, results: OptionObj) => {
      console.log("Changed text and results are", searchText, results);
    },
    []
  );
  /**
   * To fetch the available suggestion options
   */
  useEffect(() => {
    fetch(EndPoints.searchSuggestion, {
      method: "get",
    })
      .then((resp) => resp.json())
      .then((resp: any) => {
        return resp?.suggestions?.map((obj: string, i: number) => ({
          id: i,
          description: obj,
        }));
      })
      .then((resp: Array<OptionObj>) => setOptions(resp));
  }, []);

  useEffect(() => {
    if (value.length > 0)
      fetch(EndPoints.queryResult + `?data=${value}`, {
        method: "get",
      })
        .then((resp) => resp.json())
        .then((resp: any) =>
          setSearchResult(() => {
            return { ...resp };
          })
        );
  }, [value]);
  console.log("Query result is", searchResult);
  /**
   * @param item
   */
  const handleOnChange = useCallback((item: any) => {
    console.log("Selected item(s)", item);
    if (typeof item === "object") {
      setValue(item.description);
      return;
    }
    setValue(item);
  }, []);

  /**
   */
  const handleOnFocus = useCallback(() => {
    // console.log("Focus has been set to input");
  }, []);

  /**
   */
  const handleOnClear = useCallback(() => {
    console.log("Input field is cleared");
    setValue("");
    setSearchResult(() => {
      return {};
    });
  }, []);

  return (
    <>
      <AppErrorBoundary>
        <div className={appStyle.app}>
          <div className={appStyle.acContainer}>
            <div className={appStyle.acInnerContainer}>
              <AutoComplete
                maxResults={AUTOCOMPLETE_MAX_RESULTS}
                autoFocus={AUTOCOMPLETE_AUTO_FOCUS}
                inputDebounceTime={INPUT_DEBOUNCE_TIME}
                fuseConfig={DefaultFuseConfig}
                resultObjectKey={"description"}
                defaultSearchString={""}
                options={options}
                onTextChange={handleOnTextChange}
                onChange={handleOnChange}
                onFocusEvent={handleOnFocus}
                onClear={handleOnClear}
                placeholder={PLACEHOLDER_TEXT}
                theme={AutoCompleteTheme}
              ></AutoComplete>
            </div>
          </div>
          <div className={appStyle.resultContainer}>
            <div className={appStyle.resultInnerContainer}>
              <SearchResult
                result={searchResult}
                searchText={value}
              ></SearchResult>
            </div>
          </div>
        </div>
      </AppErrorBoundary>
    </>
  );
};

export default App;
