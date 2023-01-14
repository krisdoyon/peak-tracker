import { IPeakList } from "models/interfaces";
import { createContext, SetStateAction, useContext, useState } from "react";
import { peakListsArr } from "assets/data/createPeakLists";

interface Props {
  children: React.ReactNode;
}

interface IPeakListContext {
  allPeakLists: IPeakList[];
  getPeakListById: (listID: string) => IPeakList | undefined;
  savedListIds: string[];
  toggleSavedList: (listID: string) => void;
}

const getPeakListById = (listID: string) => {
  const list = peakListsArr.find((list) => list.listID === listID);
  return list;
};

const peakListContext = createContext<IPeakListContext | null>(null);

export const PeakListProvider = ({ children }: Props) => {
  const [savedListIds, setSavedListIds] = useState(["nh4k"]);

  const toggleSavedList = (listID: string) => {
    if (savedListIds.some((savedID) => savedID === listID)) {
      setSavedListIds((prevSavedIds) =>
        prevSavedIds.filter((savedId) => savedId !== listID)
      );
    } else {
      setSavedListIds([...savedListIds, listID]);
    }
  };

  return (
    <peakListContext.Provider
      value={{
        allPeakLists: peakListsArr,
        getPeakListById,
        savedListIds,
        toggleSavedList,
      }}
    >
      {children}
    </peakListContext.Provider>
  );
};

export const usePeakListContext = () => {
  const context = useContext(peakListContext);
  if (context === null) {
    throw new Error("usePeakListContext must be used within PeakListProvider");
  }
  return context;
};
