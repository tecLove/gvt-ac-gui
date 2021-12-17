import { date } from "../../../utils/util.service";
import searchResultStyle from "./SearchResult.module.scss";
import parse from "html-react-parser";

const SearchResult = ({ result, searchText }: any) => {
  console.log("text is", searchText, result);
  const hanleClick = (e: any, url: string) => {
    console.log("event is", e);
    e.preventDefault();
    window.open(url, "_blank");
  };

  const getHighlightedText = (text: string, highlight: string) => {
    let modifiedText = text;
    let _highlights = highlight.split(" ");
    _highlights.map((_highlight) => {
      modifiedText = modifiedText?.replaceAll(
        new RegExp(`${_highlight}`, "gi"),
        `<b>${_highlight}</b>`
      );
    });
    return modifiedText;
  };
  return (
    <>
      {result?.Page && result?.PageSize && result?.TotalNumberOfResults ? (
        <div
          data-testid="search-result"
          className={searchResultStyle.resultCount}
        >{`Showing ${result.Page}-${result.PageSize} of ${result.TotalNumberOfResults} results`}</div>
      ) : null}
      {result && result?.ResultItems
        ? result?.ResultItems?.map((item: any) => {
            return (
              <div
                className={searchResultStyle.searchResult}
                key={item.DocumentId}
              >
                <div className={searchResultStyle.resultItemMargin}>
                  <a
                    href={item?.DocumentURI}
                    onClick={(e: any) => hanleClick(e, item?.DocumentURI)}
                  >
                    {item?.DocumentTitle?.Text}
                  </a>
                </div>
                <div
                  className={`${searchResultStyle.resultItemMargin} ${searchResultStyle.description}`}
                >
                  {date()}
                  {" - "}
                  {parse(
                    getHighlightedText(item?.DocumentExcerpt?.Text, searchText)
                  )}
                </div>
                <div
                  className={searchResultStyle.link}
                  onClick={(e: any) => hanleClick(e, item?.DocumentURI)}
                >
                  {item?.DocumentURI}
                </div>
              </div>
            );
          })
        : null}
    </>
  );
};

export default SearchResult;
