import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { isPeakCompleted, getCompletedDate } from "utils/peakUtils";

const USER_ID = "abc123";

export const usePeak = (peakID: number) => {
  const { data: peak } = useGetListsQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => {
      const uniquePeaks = data?.flatMap((list) => list.peaks);
      const peak = uniquePeaks?.find((peak) => peak.id === peakID);
      return {
        data: peak,
        isLoading,
        isError,
      };
    },
  });
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_ID);
  const isCompleted = isPeakCompleted(peakID, allLogEntries);
  const completedDate = getCompletedDate(peakID, allLogEntries);
  return { peak, isCompleted, completedDate };
};
