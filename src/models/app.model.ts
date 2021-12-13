// export interface OptionObj {
//   id: number;
//   description: string;
// }

export interface OptionObj {
  id: number;
  description: string;
}

export interface FuseConfigObj {
  location?: number;
  distance?: number;
  threshold?: number;
  maxPatternLength?: number;
  minMatchCharLength?: number;
  isCaseSensitive?: boolean;
  shouldSort?: boolean;
  keys: Array<string>;
}

export interface ThemeObj {
  border: string;
  borderRadius: string;
  bgColorResultList: string;
  color: string;
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
  searchBxHeight: string;
  searchIconColor: string;
  pathToSearchIcon?: string;
  searchBtnIconColor?: string;
  boxShadow?: {
    show?: boolean;
    shadow?: string;
  };
  searchResultTheme: SearchResultThemeObj;
}

export interface SearchResultThemeObj {
  resultTextColor: string;
  searchIconColor: string;
}

export enum EndPoints {
  searchSuggestion = "/suggestion.json",
  queryResult = "/queryResult.json",
}
