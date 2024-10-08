import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

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
  listId: string;
  peaks: number[];
  description: string;
}

export interface ILogEntry {
  peakIds: number[];
  stats: {
    elevation: number | "";
    distance: number | "";
    minutes: number | "";
    hours: number | "";
  };
  notes: string | "";
  rating: number | "";
  logId: string;
  date: string;
  tripType: TripType;
}
