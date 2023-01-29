import { ILogEntry, IPeak, IPeakList } from "models/interfaces";

export const getAllUniquePeaks = (peakLists: IPeakList[]): IPeak[] => {
  const allPeaks = peakLists.flatMap((list) => list.peaks);
  return [...new Set(allPeaks.map((peak) => JSON.stringify(peak)))].map(
    (string) => JSON.parse(string)
  );
};

export const getMatchingListIds = (peakId: number, peakLists: IPeakList[]) => {
  const listMatchIds: string[] = [];
  peakLists.forEach((peakList) => {
    if (peakList.peaks.some((peak) => peak.id === peakId)) {
      listMatchIds.push(peakList.listId);
    }
  });
  return listMatchIds;
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
  peakId: number,
  logEntries: ILogEntry[] = []
) => {
  const allCompletedPeaks = [
    ...new Set(logEntries.flatMap((entry) => entry.peakIds)),
  ];
  return allCompletedPeaks.includes(peakId);
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
  const logId =
    logEntries.length > 0
      ? Math.max(...logEntries.map((entry) => +entry.logId)) + 1
      : 1;
  return logId.toString();
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
    .map((peakId) => allPeaks.find((peak) => peak.id === peakId))
    .filter((item): item is IPeak => !!item);
};
