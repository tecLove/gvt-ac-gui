import { date } from "../../../utils/util.service";
import searchResultStyle from "./SearchResult.module.scss";

const SearchResult = ({ result, searchText }: any) => {
  console.log("text is", searchText, result);
  const hanleClick = (e: any, url: string) => {
    console.log("event is", e);
    e.preventDefault();
    window.open(url, "_blank");
  };

  const getHighlightedText = (text: string, highlight: string) => {
    debugger;
    // Split on highlight term and include term into parts, ignore case
    const parts = text?.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  };
  return (
    <>
      {result?.Page && result?.PageSize && result?.TotalNumberOfResults ? (
        <div
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
                  {getHighlightedText(item?.DocumentExcerpt?.Text, searchText)}
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
