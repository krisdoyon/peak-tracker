import { LogActionType, useLogContext } from "context/logContext";
import { useEffect } from "react";
import { useFilterSelectOptions } from "./useFilterSelectOptions";

// This hook is used for the edge case of the user deleting the last log entry that matches a given filter while that filter is selected. This will reset the filter value to "all" for the now non-matching filter.

export const useFiltersReset = () => {
  const {
    state: { filters },
    dispatch,
  } = useLogContext();

  const { lists, months, years } = useFilterSelectOptions();

  useEffect(() => {
    if (
      filters.listID !== "all" &&
      !lists.some((list) => list.listID === filters.listID)
    ) {
      dispatch({
        type: LogActionType.UPDATE_FILTERS,
        payload: { filter: "listID", value: "all" },
      });
    }
    if (
      filters.month !== "all" &&
      !months.some((month) => month.numeric === filters.month)
    ) {
      dispatch({
        type: LogActionType.UPDATE_FILTERS,
        payload: { filter: "month", value: "all" },
      });
    }
    if (filters.year !== "all" && !years.includes(filters.year)) {
      dispatch({
        type: LogActionType.UPDATE_FILTERS,
        payload: { filter: "year", value: "all" },
      });
    }
  }, [lists, months, years]);
};
