import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { getLogLists } from "utils/peakUtils";
import { useAppSelector } from "./reduxHooks";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const useFilteredLogEntries = () => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const filters = useAppSelector((state) => state.filters);
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(
    {
      userId,
      token,
      tripType: TripType.COMPLETED,
    },
    { skip: userId === null || !isLoggedIn || token === null }
  );
  const { data: allPeakLists = [] } = useGetListsQuery();

  let filteredEntries = [...allLogEntries];
  if (filters.listId !== "all") {
    filteredEntries = filteredEntries.filter((entry) => {
      const listIdMatchIds = getLogLists(entry?.peakIds, allPeakLists);
      return listIdMatchIds.some((listId) => listId === filters.listId);
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
