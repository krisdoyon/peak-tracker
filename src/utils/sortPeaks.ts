import { IPeak } from "models/interfaces";

export enum SortType {
  ELEVATION = "elevation",
  NAME = "name",
  STATE = "state",
}

export const sortPeaks = (peaksArr: IPeak[], sortType: SortType) => {
  if (sortType === SortType.ELEVATION) {
    peaksArr.sort((a, b) => b.elevation - a.elevation);
  }
  if (sortType === SortType.NAME) {
    peaksArr.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
  if (sortType === SortType.STATE) {
    peaksArr.sort((a, b) =>
      a.state.toLowerCase().localeCompare(b.state.toLowerCase())
    );
  }
  return peaksArr;
};
