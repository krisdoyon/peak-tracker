import { ILogEntry, IPeakList } from "models/interfaces";

const getAllCompletedPeaks = (logEntries: ILogEntry[]) => {
  return [...new Set(logEntries.flatMap((entry) => entry.peakIds))];
};

const getMatchingListIds = (peakID: number, peakLists: IPeakList[]) => {
  const listMatchIds: string[] = [];
  peakLists.forEach((peakList) => {
    if (peakList.peaks.some((peak) => peak.id === peakID)) {
      listMatchIds.push(peakList.listID);
    }
  });
  return listMatchIds;
};

export const calculateListCounts = (
  peakLists: IPeakList[],
  logEntries: ILogEntry[]
) => {
  const completedPeaks = getAllCompletedPeaks(logEntries);
  const listCounts: { [listID: string]: number } = {};
  peakLists.forEach((peakList) => {
    listCounts[peakList.listID] = 0;
  });
  completedPeaks.forEach((peakID) => {
    const listMatchIds = getMatchingListIds(peakID, peakLists);
    listMatchIds.forEach((listID) => {
      listCounts[listID]++;
    });
  });
  return listCounts;
};

export const getLogListIds = (peakIds: number[], peakLists: IPeakList[]) => {
  return [
    ...new Set(
      peakIds.flatMap((peakId) => getMatchingListIds(peakId, peakLists))
    ),
  ];
};

export const getPeakById = (peakId: number, peakLists: IPeakList[]) => {
  const uniquePeaks = [...new Set(peakLists.flatMap((list) => list.peaks))];
  return uniquePeaks.find((peak) => peak.id === peakId);
};
