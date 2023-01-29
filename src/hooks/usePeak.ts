import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { isPeakCompleted, getCompletedDate } from "utils/peakUtils";

const USER_Id = "abc123";

export const usePeak = (peakId: number) => {
  const { data: peak } = useGetListsQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => {
      const uniquePeaks = data?.flatMap((list) => list.peaks);
      const peak = uniquePeaks?.find((peak) => peak.id === peakId);
      return {
        data: peak,
        isLoading,
        isError,
      };
    },
  });
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_Id);
  const isCompleted = isPeakCompleted(peakId, allLogEntries);
  const completedDate = getCompletedDate(peakId, allLogEntries);
  return { peak, isCompleted, completedDate };
};
