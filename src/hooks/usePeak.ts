import { useGetPeaksQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { isPeakCompleted, getCompletedDate } from "utils/peakUtils";
import { useAppSelector } from "hooks/reduxHooks";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const usePeak = (peakId: number) => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);
  const { data: peak } = useGetPeaksQuery(undefined, {
    selectFromResult: ({ data, isLoading, isError }) => {
      const peak = data?.find((peak) => peak.id === peakId);
      return {
        data: peak,
        isLoading,
        isError,
      };
    },
  });
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(
    { userId, token, tripType: TripType.COMPLETED },
    { skip: userId === null || !isLoggedIn || token === null }
  );
  const isCompleted = isPeakCompleted(peakId, allLogEntries);
  const completedDate = getCompletedDate(peakId, allLogEntries);
  return { peak, isCompleted, completedDate };
};
