import { usePeakListsQuery } from "./usePeakListsQuery";
import { useLogEntriesQuery } from "./useLogEntriesQuery";
import { calculateListCounts } from "utils/peakUtils";

export const useListCounts = () => {
  const { allPeakLists, isLoading: isPeakListLoading } = usePeakListsQuery();
  const { allLogEntries, isLoading: isLogEntryLoading } = useLogEntriesQuery();
  const listCounts = calculateListCounts(allPeakLists, allLogEntries);
  return { listCounts, isLoading: isPeakListLoading || isLogEntryLoading };
};
