import { OptionObj, SearchResultThemeObj } from "../../../models/app.model";
import SuggestionClass from "./Suggestion.module.scss";

interface SuggestionProps {
  maxResults: any;
  resultObjectKey: string;
  results: Array<OptionObj>;
  onClick: Function;
  onHover?: Function;
  theme?: SearchResultThemeObj;
  cursor: number;
  handleListRef: any;
}

const Suggestion = ({
  maxResults,
  resultObjectKey,
  results,
  onClick,
  onHover,
  theme,
  cursor,
  handleListRef,
}: SuggestionProps) => {
  const handleClick = (result: OptionObj) => {
    onClick(result);
  };

  const handleMouseEnter = (result: OptionObj) => {
    if (onHover) onHover(result);
  };

  const style = {
    backgroundColor: "rgba(211, 211, 211, 0.4)",
  };

  return (
    <div className={SuggestionClass.searchResult} ref={handleListRef}>
      {results?.length > 0
        ? results.slice(0, maxResults).map((result: any, index: number) => {
            return (
              <div
                className={`${SuggestionClass.container}`}
                key={`result-${result.id}`}
                style={index === cursor ? style : {}}
                onMouseEnter={() => {
                  handleMouseEnter(result);
                }}
                onMouseDown={() => handleClick(result)}
                onClick={() => handleClick(result)}
              >
                <svg
                  height="25"
                  width="25"
                  focusable="false"
                  viewBox="0 0 24 24"
                  className={SuggestionClass.searchIcon}
                  style={theme ? { fill: theme.searchIconColor } : {}}
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
                <div
                  className={`${SuggestionClass.searchResultList}`}
                  style={
                    theme
                      ? {
                          color: theme.resultTextColor,
                        }
                      : {}
                  }
                  data-testid={`result-${result.id}`}
                >
                  {result[resultObjectKey]}
                </div>
              </div>
            );
          })
        : null}
    </div>
  );
};

export default Suggestion;
