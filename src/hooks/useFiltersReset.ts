import { useFilterContext } from "context/filterContext";
import { useEffect } from "react";
import { useFilterSelectOptions } from "./useFilterSelectOptions";

// This hook is used for the edge case of the user deleting the last log entry that matches a given filter while that filter is selected. This will reset the filter value to "all" for the now non-matching filter.

export const useFiltersReset = () => {
  const { filters, setFilters } = useFilterContext();
  const { lists, months, years } = useFilterSelectOptions();

  useEffect(() => {
    if (
      filters.listID !== "all" &&
      !lists.some((list) => list.listID === filters.listID)
    ) {
      setFilters((prevFilters) => ({ ...prevFilters, listID: "all" }));
    }
    if (
      filters.month !== "all" &&
      !months.some((month) => month.numeric === filters.month)
    ) {
      setFilters((prevFilters) => ({ ...prevFilters, month: "all" }));
    }
    if (filters.year !== "all" && !years.includes(filters.year)) {
      setFilters((prevFilters) => ({ ...prevFilters, year: "all" }));
    }
  }, [lists, months, years]);
};
