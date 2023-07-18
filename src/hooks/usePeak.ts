import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { isPeakCompleted, getCompletedDate } from "utils/peakUtils";
import { useAppSelector } from "hooks/reduxHooks";

export const usePeak = (peakId: number) => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);
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
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn || token === null }
  );
  const isCompleted = isPeakCompleted(peakId, allLogEntries);
  const completedDate = getCompletedDate(peakId, allLogEntries);
  return { peak, isCompleted, completedDate };
};
