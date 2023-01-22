import { useAllPeakLists } from "./usePeakLists";

export const usePeakList = (listID: string) => {
  const lists = useAllPeakLists();
  if (lists) {
    return lists.find((list) => list.listID === listID);
  }
};
