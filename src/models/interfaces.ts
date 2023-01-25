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
  peaks: IPeak[];
  description: string;
}

export interface ILogEntry {
  peakIds: number[];
  stats: {
    elevation: number | "";
    distance: number | "";
    minutes: number | "";
    hours: number | "";
    time: number | "";
    avgSpeed: number | "";
    avgElevation: number | "";
  };
  notes: string | "";
  rating: number | "";
  logID: string;
  date: string;
}
