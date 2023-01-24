import { calculateListCounts } from "utils/peakUtils";
import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { useMemo } from "react";

export const useListCounts = (userId: string) => {
  const { data: allPeakLists } = useGetListsQuery();
  const { data: allLogEntries } = useGetLogEntriesQuery(userId);
  const listCounts = useMemo(
    () => calculateListCounts(allPeakLists, allLogEntries),
    [allPeakLists, allLogEntries]
  );
  return { listCounts };
};
