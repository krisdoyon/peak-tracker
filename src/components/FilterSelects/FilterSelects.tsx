import { LogActionKind, useLogContext } from "context/logContext";
import { FilterType } from "models/interfaces";
import { useEffect } from "react";
import styles from "./FilterSelects.module.scss";

interface Props {
  card: "stats" | "log";
  updateFilters: (filter: FilterType, value: string) => void;
}

export const FilterSelects = ({ card, updateFilters }: Props) => {
  const {
    state: { logEntries, filters },
    dispatch,
    getFilterSelectOptions,
  } = useLogContext();
  const { lists, months, years } = getFilterSelectOptions();

  useEffect(() => {
    if (
      filters.listID !== "all" &&
      !lists.some((list) => list.listID === filters.listID)
    ) {
      dispatch({
        type: LogActionKind.UPDATE_FILTERS,
        payload: { filter: "listID", value: "all" },
      });
    }
    if (
      filters.month !== "all" &&
      !months.some((month) => month.numeric === filters.month)
    ) {
      dispatch({
        type: LogActionKind.UPDATE_FILTERS,
        payload: { filter: "month", value: "all" },
      });
    }
    if (filters.year !== "all" && !years.includes(filters.year)) {
      dispatch({
        type: LogActionKind.UPDATE_FILTERS,
        payload: { filter: "year", value: "all" },
      });
    }
  }, [lists, months, years]);

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
