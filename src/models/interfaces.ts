export interface IPeak {
  id: number;
  name: string;
  lat: number;
  long: number;
  elevation: number;
  state: string;
}

export interface IPeakList {
  title: string;
  listID: string;
  peakCount: number;
  peaks: IPeak[];
  description: string;
}

export interface ILogEntry {
  peaks: IPeak[];
  stats: {
    elevation: number | null;
    distance: number | null;
    minutes: number | null;
    hours: number | null;
    time: number | null;
    avgSpeed: number | null;
    avgElevation: number | null;
  };
  notes: string | null;
  rating: number | null;
  logID: string;
  timestamp: number;
  displayDate: string;
  lists: { listID: string; title: string }[];
}
