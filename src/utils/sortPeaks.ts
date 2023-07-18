import { IPeak } from "models/interfaces";

export enum SortType {
  ELEVATION = "elevation",
  NAME = "name",
  STATE = "state",
}

export const sortPeaks = (peaksArr: IPeak[] = [], sortType: SortType) => {
  const arrCopy = [...peaksArr];
  if (sortType === SortType.ELEVATION) {
    arrCopy.sort((a, b) => b.elevation - a.elevation);
  }
  if (sortType === SortType.NAME) {
    arrCopy.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
  }
  if (sortType === SortType.STATE) {
    arrCopy.sort((a, b) =>
      a.state.toLowerCase().localeCompare(b.state.toLowerCase())
    );
  }
  return arrCopy;
};
