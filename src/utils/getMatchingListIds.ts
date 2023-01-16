import { IPeakList } from "models/interfaces";

export const getMatchingListIds = (
  peakListsArr: IPeakList[],
  peakID: number
) => {
  const listMatchIds: string[] = [];
  peakListsArr.forEach((peakList) => {
    if (peakList.peaks.some((peak) => peak.id === peakID)) {
      listMatchIds.push(peakList.listID);
    }
  });
  return listMatchIds;
};
