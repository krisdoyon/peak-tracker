import { LogActionKind, useLogContext } from "context/logContext";
import { FilterType } from "models/interfaces";
import { useEffect } from "react";
import styles from "./FilterSelects.module.scss";

interface Props {
  card: "stats" | "log";
  updateFilters: (filter: FilterType, value: string) => void;
  filterValues: { listID: string; month: string; year: string };
}

export const FilterSelects = ({ card, updateFilters, filterValues }: Props) => {
  const { getFilterSelectOptions } = useLogContext();
  const { lists, months, years } = getFilterSelectOptions();

  return (
    <>
      <label htmlFor={`select-list-${card}`}>Filter by list:</label>
      <select
        className={styles["select-list"]}
        id={`select-list-${card}`}
        onChange={(e) => {
          updateFilters(FilterType.LIST_ID, e.target.value);
        }}
        value={filterValues.listID}
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
        value={filterValues.month}
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
        value={filterValues.year}
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
