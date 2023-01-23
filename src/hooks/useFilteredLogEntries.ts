import { getLogListIds } from "utils/peakUtils";
import { useLogEntriesQuery } from "./useLogEntriesQuery";
import { usePeakListsQuery } from "./usePeakListsQuery";

export const useFilteredLogEntries = (filters: {
  listID: string;
  month: string;
  year: string;
}) => {
  const { allLogEntries } = useLogEntriesQuery();
  const { allPeakLists } = usePeakListsQuery();

  let filteredEntries = allLogEntries;
  if (filters.listID !== "all") {
    filteredEntries = filteredEntries.filter((entry) => {
      const listIdMatches = getLogListIds(entry.peakIds, allPeakLists);
      return listIdMatches.some((listID) => listID === filters.listID);
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
