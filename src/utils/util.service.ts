/**
 * returns date in d MMM yyyy format
 * @returns
 */
const date = () => {
  const _date = new Date();
  return (
    _date.getDate() +
    " " +
    _date.toLocaleString("default", { month: "short" }) +
    " " +
    _date.getFullYear()
  );
};

export { date };
