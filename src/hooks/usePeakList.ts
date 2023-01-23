import { usePeakListsQuery } from "./usePeakListsQuery";

export const usePeakList = (listID: string) => {
  const { allPeakLists, isLoading, isError } = usePeakListsQuery();
  return {
    peakList: allPeakLists.find((list) => list.listID === listID),
    isLoading,
    isError,
  };
};
