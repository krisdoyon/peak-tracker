import { ILogEntry } from "models/interfaces";

export const getStats = (logEntries: ILogEntry[]) => {
  const numEntries = logEntries.length;
  const numPeaks = [...new Set(logEntries.flatMap((entry) => entry.peakIds))]
    .length;
  const { distance, elevation, time } = logEntries.reduce(
    (acc, cur) => {
      return {
        distance: acc.distance + (cur.stats.distance || 0),
        elevation: acc.elevation + (cur.stats.elevation || 0),
        time: acc.time + (cur.stats.hours || 0) + (cur.stats.minutes || 0) / 60,
      };
    },
    { distance: 0, elevation: 0, time: 0 }
  );
  return {
    numEntries,
    numPeaks,
    distance: Math.round(distance * 10) / 10,
    elevation: Math.round(elevation * 10) / 10,
    time: Math.round(time * 10) / 10,
  };
};
