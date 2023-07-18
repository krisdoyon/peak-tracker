import styles from "./FilterSelects.module.scss";
import { useFilterSelectOptions } from "hooks/useFilterSelectOptions";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { updateFilters } from "features/filtersSlice";

interface Props {
  card: "stats" | "log";
}

export const FilterSelects = ({ card }: Props) => {
  const { lists, months, years } = useFilterSelectOptions();
  const filters = useAppSelector((state) => state.filters);
  const dispatch = useAppDispatch();

  return (
    <>
      <label htmlFor={`select-list-${card}`}>Filter by list:</label>
      <select
        className={styles["select-list"]}
        id={`select-list-${card}`}
        onChange={(e) =>
          dispatch(updateFilters({ filter: "listId", value: e.target.value }))
        }
        value={filters.listId}
      >
        <option value="all">All lists</option>
        {lists.map((list) => {
          return (
            <option key={list.listId} value={list.listId}>
              {list.title}
            </option>
          );
        })}
      </select>
      <label htmlFor={`select-month-${card}`}>Filter by date:</label>
      <select
        id={`select-month-${card}`}
        onChange={(e) => {
          dispatch(updateFilters({ filter: "month", value: e.target.value }));
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
          dispatch(updateFilters({ filter: "year", value: e.target.value }));
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
