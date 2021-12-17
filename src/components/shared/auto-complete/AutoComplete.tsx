import Fuse from "fuse.js";
import React, { useEffect, useRef, useState } from "react";
import { FuseConfigObj, OptionObj, ThemeObj } from "../../../models/app.model";
import SearchResult from "../suggestion/Suggestion";
import debounce from "lodash.debounce";
import AutoCompleteStyle from "./AutoComplete.module.scss";
import closeIcon from "../../../images/close_black_24dp.svg";

interface AutoCompleteProps {
  options: Array<OptionObj>;
  onTextChange?: Function;
  onChange?: Function;
  onHover?: Function;
  onClear?: Function;
  onFocusEvent?: any;
  maxResults?: number;
  inputDebounceTime?: number;
  fuseConfig: FuseConfigObj;
  placeholder?: string;
  autoFocus?: boolean;
  resultObjectKey: string;
  defaultSearchString?: string;
  theme?: ThemeObj;
}

const AutoComplete = ({
  options,
  onTextChange,
  onChange,
  onHover,
  onFocusEvent,
  onClear,
  maxResults,
  inputDebounceTime,
  fuseConfig,
  placeholder,
  autoFocus,
  resultObjectKey,
  defaultSearchString,
  theme,
}: AutoCompleteProps) => {
  const fuse = fuseConfig
    ? new Fuse(options, { ...fuseConfig })
    : new Fuse(options);

  const [searchResults, setSearchResults] = useState([]);

  const [searchText, setSearchText] = useState(
    defaultSearchString ? defaultSearchString : ""
  );

  const [isFocus, setFocus] = useState(autoFocus);

  const [cursor, setCursor] = useState(0);

  const maxResultDefault = 30;

  const inputRef = useRef<HTMLInputElement>(null);
  let listRef = useRef<HTMLDivElement>(null);

  /**
   * The below effect is to set the state where defaultSearchString is changing
   * dynamically and being passed as props `defaultSearchString`
   */
  useEffect(() => {
    if (defaultSearchString) {
      setSearchText(defaultSearchString);
    }
  }, [defaultSearchString]);

  /**
   * The below effect is to serve the purpose where available options are being fetched
   * dynamically and being passed as props `options`
   */
  useEffect(() => {
    if (searchText?.length > 0) {
      const res: any = fuseSerchResults(searchText);
      setSearchResults(res);
    }
  }, [options]);

  /**
   * To clear the debounce when component ummounts
   */
  useEffect(() => {
    return () => {
      debounceCall?.cancel();
    };
  }, []);

  /**
   * Handles the selection of an entry from the results displayed.
   * @param result
   */
  const handleOnClick = (result: any) => {
    setSearchText(() => {
      return result[resultObjectKey];
    });
    if (onChange) onChange(result[resultObjectKey]);
    setSearchResults([]);
    setCursor(0);
  };

  const handleSearchBtnClick = () => {
    setSearchResults([]);
    if (onChange) onChange(searchText);
  };
  /**
   * Searches with the string, if present in the input field, on focus set to input field
   * And calls the parent call back if it was passed in.
   */
  const onFocus = () => {
    setFocus(true);
    if (searchText?.length > 0) {
      const res: any = fuseSerchResults(searchText);
      setSearchResults(res);
      if (onFocusEvent) onFocusEvent();
    }
  };

  /**
   * Method gets invoked whenever there is an input value change and starts searching.
   * @param $event
   */
  const handleSearch = ($event: any) => {
    const inputValue = $event.target.value;
    setSearchText(() => {
      return inputValue;
    });
    debounceCall(inputValue);
    if (inputValue?.length === 0) {
      if (onClear) onClear();
    }
  };

  /**
   * This method postpones the search query to the specified time to allow user to finish typing and not to make
   * unnecessary calls. This improves performance as well.
   */
  const debounceCall = debounce(
    (inputValue) => search(inputValue),
    inputDebounceTime ? inputDebounceTime : 300
  );

  /**
   * Calls Fuse to fetch search results
   * @param inputValue
   */
  const search = (inputValue: string) => {
    let modifiedResults: any = [];
    if (inputValue?.length > 2) {
      modifiedResults = fuseSerchResults(inputValue);
      setSearchResults(modifiedResults);
      if (onTextChange) onTextChange(inputValue, modifiedResults);
    } else {
      setSearchResults(modifiedResults);
    }
  };

  /**
   * Gives search results as per the collection provided to Fuse
   * @param keyword
   * @returns
   */
  const fuseSerchResults = (keyword: string) => {
    return fuse
      .search(keyword, { limit: maxResults ? maxResults : maxResultDefault })
      .map((result) => ({ ...result.item }))
      .slice(0, maxResults ? maxResults : maxResultDefault);
  };

  const containerClass =
    isFocus && theme?.boxShadow?.show
      ? `${AutoCompleteStyle.container} ${AutoCompleteStyle.containerShadow}`
      : `${AutoCompleteStyle.container}`;

  const containerStyle = {
    ...(theme
      ? {
          border: theme.border,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.bgColorResultList,
        }
      : {}),
    ...(isFocus && theme?.boxShadow?.show && theme?.boxShadow?.shadow
      ? {
          boxShadow: theme.boxShadow.shadow,
        }
      : {}),
  };

  /**
   *
   * @param e
   */
  const handleKeyDown = (e: any) => {
    console.log("Scroll height is", listRef?.current?.clientHeight);
    if (e.keyCode === 38) {
      if (cursor > 0) {
        setCursor((prevCursor) => {
          console.log("Cursor is", cursor);
          setSearchText(searchResults[prevCursor - 1][resultObjectKey]);
          return prevCursor - 1;
        });
      } else {
        setCursor(() => {
          console.log("Cursor is", cursor);
          setSearchText(
            searchResults[searchResults.length - 1][resultObjectKey]
          );
          return searchResults.length - 1;
        });
      }
    } else if (e.keyCode === 40) {
      if (cursor < searchResults.length - 1) {
        setCursor((prevCursor) => {
          console.log("Cursor is", cursor);
          setSearchText(searchResults[prevCursor + 1][resultObjectKey]);
          return prevCursor + 1;
        });
      } else {
        setCursor(() => {
          console.log("Cursor is", cursor);
          setSearchText(searchResults[0][resultObjectKey]);
          return 0;
        });
      }
    } else if (e.keyCode === 13) {
      handleSearchBtnClick();
      inputRef.current?.blur();
      setFocus(false);
    }
  };

  const onHoverEvent = (ev: any) => {
    console.log("Mouse over event triggered", ev);
    const cursorPos = searchResults.findIndex(
      (result: OptionObj) => ev.id === result.id
    );
    setCursor(cursorPos);
    if (onHover) onHover(ev);
  };

  const handleListRef = (e: any) => {
    listRef = e;
    console.log("element is", e);
  };

  const handleClear = () => {
    inputRef.current?.focus();
    if (onClear) onClear();
  };

  return (
    <>
      <div
        className={AutoCompleteStyle.autoComplete}
        style={theme ? { height: theme.searchBxHeight } : {}}
      >
        <div className={AutoCompleteStyle.outerContainer}>
          <div className={containerClass} style={containerStyle}>
            <div className={AutoCompleteStyle.inputBx}>
              <svg
                height="25"
                width="25"
                focusable="false"
                viewBox="0 0 24 24"
                className={AutoCompleteStyle.searchIcon}
                style={theme ? { fill: theme.searchIconColor } : {}}
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
              </svg>
              <input
                ref={inputRef}
                className={`${AutoCompleteStyle.inputLayout}`}
                style={
                  theme
                    ? {
                        color: theme.color,
                        fontFamily: theme.fontFamily,
                        fontSize: theme.fontSize,
                        fontWeight: theme.fontWeight,
                      }
                    : {}
                }
                value={searchText}
                data-testid={"search-input-box"}
                onBlur={() => {
                  setSearchResults([]);
                  setFocus(false);
                }}
                onFocus={onFocus}
                placeholder={placeholder}
                spellCheck={false}
                autoComplete="off"
                onChange={handleSearch}
                autoFocus={autoFocus ? autoFocus : false}
                onKeyDown={handleKeyDown}
              />{" "}
              {searchText.length >= 1 ? (
                <img
                  alt=""
                  src={closeIcon}
                  height="20px"
                  width="20px"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSearchText("");
                    handleClear();
                  }}
                />
              ) : null}
            </div>
            <SearchResult
              results={searchResults}
              onClick={handleOnClick}
              onHover={onHoverEvent}
              maxResults={maxResults ? maxResults : maxResultDefault}
              resultObjectKey={resultObjectKey}
              theme={theme?.searchResultTheme}
              cursor={cursor}
              handleListRef={handleListRef}
            />
          </div>
        </div>
        <div
          className={AutoCompleteStyle.searchBtnContainer}
          onClick={handleSearchBtnClick}
        >
          <div className={AutoCompleteStyle.searchBtn}>
            <svg
              height="25"
              width="25"
              focusable="false"
              viewBox="0 0 24 24"
              className={AutoCompleteStyle.searchBtnIcon}
              style={theme ? { fill: theme.searchBtnIconColor } : {}}
            >
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
            <div>Search</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(AutoComplete);
