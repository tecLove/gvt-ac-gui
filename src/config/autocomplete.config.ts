import { FuseConfigObj, ThemeObj } from "../models/app.model";

/** It contains Fuse configs which are needed to initialize lib with values passed in
 * Following values can be added with values other than their default value
     location: 0,
     distance: 100,
     threshold: 0.6,
     maxPatternLength: 32,
     minMatchCharLength: 1,
  **/
const DefaultFuseConfig: FuseConfigObj = {
  isCaseSensitive: false,
  shouldSort: true,
  keys: ["description"],
};

// Max number of results to be displayed for a search
const AUTOCOMPLETE_MAX_RESULTS = 6;
// To set focus to input field
const AUTOCOMPLETE_AUTO_FOCUS = true;
// Debounce time in ms
const INPUT_DEBOUNCE_TIME = 0;
// Input field placeholder text
const PLACEHOLDER_TEXT = "Start typing to search";

const searchIconColor = "#696969";
const AutoCompleteTheme: ThemeObj = {
  border: "1px solid #dfe1e5",
  borderRadius: "12px",
  bgColorResultList: "#fff",
  color: "rgba(0, 0, 0, 0.87)",
  fontFamily: "inherit",
  fontWeight: "500",
  fontSize: "16px",
  searchBxHeight: "46px",
  searchIconColor: searchIconColor,
  searchBtnIconColor: "#fff",
  boxShadow: {
    show: true,
    shadow: "0 1px 6px rgba(32, 33, 36, 0.4)",
  },
  searchResultTheme: {
    resultTextColor: "rgba(0, 0, 0, 0.87)",
    searchIconColor: searchIconColor,
  },
};

export {
  DefaultFuseConfig,
  AutoCompleteTheme,
  AUTOCOMPLETE_MAX_RESULTS,
  AUTOCOMPLETE_AUTO_FOCUS,
  INPUT_DEBOUNCE_TIME,
  PLACEHOLDER_TEXT,
};
