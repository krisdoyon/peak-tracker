import { useGetPeaksQuery } from "features/apiSlice";
import { usePeakList } from "./usePeakList";
import { IPeak } from "models/interfaces";

export const usePeakListPeaks = (listId: string) => {
  const { data: peakList = [] } = usePeakList(listId);
  const { data: allPeaks = [] } = useGetPeaksQuery();

  let matchingPeaks: IPeak[] = [];

  if (peakList && "peaks" in peakList) {
    matchingPeaks = allPeaks.filter((allPeak) =>
      peakList.peaks.some((peak) => peak === allPeak.id)
    );
  }

  return matchingPeaks;
};
