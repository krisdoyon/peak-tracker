import { ILogEntry, IPeakList } from "models/interfaces";

const getAllCompletedPeaks = (logEntries: ILogEntry[]) => {
  return [...new Set(logEntries.flatMap((entry) => entry.peakIds))];
};

export const getAllUniquePeaks = (peakLists: IPeakList[]) => {
  const allPeaks = peakLists.flatMap((list) => list.peaks);
  return [...new Set(allPeaks.map((peak) => JSON.stringify(peak)))].map(
    (string) => JSON.parse(string)
  );
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
  peakLists: IPeakList[] = [],
  logEntries: ILogEntry[] = []
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

export const getLogLists = (peakIds: number[], peakLists: IPeakList[]) => {
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

export const isPeakCompleted = (
  peakID: number,
  logEntries: ILogEntry[] = []
) => {
  const allCompletedPeaks = [
    ...new Set(logEntries.flatMap((entry) => entry.peakIds)),
  ];
  return allCompletedPeaks.includes(peakID);
};

export const getCompletedDate = (peakId: number, logEntries: ILogEntry[]) => {
  const dateMatches = logEntries
    .filter((entry) => entry.peakIds.includes(peakId))
    .map((entry) => entry.date);
  const mostRecent = dateMatches.reduce((max, cur) => {
    if (cur.localeCompare(max) > 0) {
      return cur;
    } else {
      return max;
    }
  }, dateMatches[0]);

  if (mostRecent) {
    return new Intl.DateTimeFormat("en-us", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(`${mostRecent}T00:00`));
  }
};

export const getPeakNames = (
  peakIdsArr: number[],
  peakLists: IPeakList[] = []
) => {
  const allPeaks = getAllUniquePeaks(peakLists);
  const peakNamesArr = peakIdsArr.map((peakId) => {
    const peakMatch = allPeaks.find((peak) => peak.id === peakId);
    return peakMatch?.name;
  });
  return peakNamesArr;
};

export const setLogEntryId = (logEntries: ILogEntry[]) => {
  const logID =
    logEntries.length > 0
      ? Math.max(...logEntries.map((entry) => +entry.logID)) + 1
      : 1;
  return logID.toString();
};

interface GetLogStatsProps {
  distance: number | "";
  elevation: number | "";
  hours: number | "";
  minutes: number | "";
}

export const getLogStats = ({
  distance,
  elevation,
  hours,
  minutes,
}: GetLogStatsProps): {
  time: number | "";
  avgSpeed: number | "";
  avgElevation: number | "";
} => {
  const time =
    hours || minutes
      ? Math.round(((hours || 0) + (minutes || 0) / 60) * 10) / 10
      : "";
  const avgSpeed =
    distance && time ? Math.round((distance / time) * 10) / 10 : "";
  const avgElevation =
    elevation && distance ? Math.round(elevation / distance) : "";
  return { time, avgSpeed, avgElevation };
};

export const getPeaksById = (peakIds: number[], peakLists: IPeakList[]) => {
  const allPeaks = getAllUniquePeaks(peakLists);
  return peakIds
    .map((peakID) => allPeaks.find((peak) => peak.id === peakID))
    .filter((item) => item !== undefined);
};
