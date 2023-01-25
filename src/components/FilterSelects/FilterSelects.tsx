import styles from "./FilterSelects.module.scss";
import { useFilterSelectOptions } from "hooks/useFilterSelectOptions";
import { useFilterContext } from "context/filterContext";

interface Props {
  card: "stats" | "log";
}

export enum FilterType {
  LIST_ID = "listID",
  MONTH = "month",
  YEAR = "year",
}

export const FilterSelects = ({ card }: Props) => {
  const { lists, months, years } = useFilterSelectOptions();
  const { filters, setFilters } = useFilterContext();

  const updateFilters = (filter: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filter]: value }));
  };

  return (
    <>
      <label htmlFor={`select-list-${card}`}>Filter by list:</label>
      <select
        className={styles["select-list"]}
        id={`select-list-${card}`}
        onChange={(e) => {
          updateFilters(FilterType.LIST_ID, e.target.value);
        }}
        value={filters.listID}
      >
        <option value="all">All lists</option>
        {lists.map((list) => {
          return (
            <option key={list.listID} value={list.listID}>
              {list.title}
            </option>
          );
        })}
      </select>
      <label htmlFor={`select-month-${card}`}>Filter by date:</label>
      <select
        id={`select-month-${card}`}
        onChange={(e) => {
          updateFilters(FilterType.MONTH, e.target.value);
        }}
        value={filters.month}
      >
        <option value="all">All Months</option>
        {months.map((month) => {
          return (
            <option key={month.numeric} value={month.numeric}>
              {month.alpha}
            </option>
          );
        })}
      </select>
      <select
        id={`select-year-${card}`}
        onChange={(e) => {
          updateFilters(FilterType.YEAR, e.target.value);
        }}
        value={filters.year}
      >
        <option value="all">All years</option>
        {years.map((year) => {
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>
    </>
  );
};
