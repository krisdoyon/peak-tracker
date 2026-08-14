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
    allPeakLists.forEach((list) => {
      const { peaks, listId } = list;
      if (peaks.includes(peakId)) {
        listCounts[listId]++;
      }
    });
  });
  return listCounts;
};
