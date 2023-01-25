import { useFilterContext } from "context/filterContext";
import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { getLogLists } from "utils/peakUtils";

const USER_ID = "abc123";

export const useFilteredLogEntries = () => {
  const { filters } = useFilterContext();
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_ID);
  const { data: allPeakLists = [] } = useGetListsQuery();

  let filteredEntries = [...allLogEntries];
  if (filters.listID !== "all") {
    filteredEntries = filteredEntries.filter((entry) => {
      const listIdMatchIds = getLogLists(entry.peakIds, allPeakLists);
      return listIdMatchIds.some((listID) => listID === filters.listID);
    });
  }
  if (filters.month !== "all") {
    filteredEntries = filteredEntries.filter((entry) => {
      const month = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
      }).format(new Date(`${entry.date}T00:00:00`));
      return month === filters.month;
    });
  }
  if (filters.year !== "all") {
    filteredEntries = filteredEntries.filter((entry) => {
      const year = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
      }).format(new Date(`${entry.date}T00:00:00`));
      return year === filters.year;
    });
  }
  return filteredEntries.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};
