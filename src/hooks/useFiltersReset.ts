import { updateFilters } from "features/filtersSlice";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { useFilterSelectOptions } from "./useFilterSelectOptions";

// This hook is used for the edge case of the user deleting the last log entry that matches a given filter while that filter is selected. This will reset the filter value to "all" for the now non-matching filter.

export const useFiltersReset = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const { lists, months, years } = useFilterSelectOptions();

  useEffect(() => {
    if (
      filters.listId !== "all" &&
      !lists.some((list) => list.listId === filters.listId)
    ) {
      dispatch(updateFilters({ filter: "listId", value: "all" }));
    }
    if (
      filters.month !== "all" &&
      !months.some((month) => month.numeric === filters.month)
    ) {
      dispatch(updateFilters({ filter: "month", value: "all" }));
    }
    if (filters.year !== "all" && !years.includes(filters.year)) {
      dispatch(updateFilters({ filter: "year", value: "all" }));
    }
  }, [lists, months, years]);
};
