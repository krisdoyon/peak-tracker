import { getMatchingListIds } from "utils/peakUtils";
import { useGetListsQuery } from "features/apiSlice";
import { useAllCompletedPeaks } from "./useAllCompletedPeaks";

export const useListCounts = () => {
  const { data: allPeakLists = [] } = useGetListsQuery();
  const completedPeaks = useAllCompletedPeaks();

  const listCounts: { [listId: string]: number } = {};
  allPeakLists.forEach((peakList) => {
    listCounts[peakList.listId] = 0;
  });
  completedPeaks.forEach((peakId) => {
    const listMatchIds = getMatchingListIds(peakId, allPeakLists);
    listMatchIds.forEach((listId) => {
      listCounts[listId]++;
    });
  });
  return listCounts;
};
