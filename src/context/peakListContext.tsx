import { ILogEntry, IPeak, IPeakList } from "models/interfaces";
import { createContext, useContext, useMemo, useReducer } from "react";
import { peakListsArr } from "assets/data/createPeakLists";
import { useLogContext } from "./logContext";

interface Props {
  children: React.ReactNode;
}

export enum PeakListActionType {
  TOGGLE_SAVED_LIST,
  SET_COMPLETED_PEAKS,
  SET_LIST_COUNTS,
}

interface IPeakListState {
  allPeakLists: IPeakList[];
  savedListIds: string[];
  completedPeaks: number[];
  listCounts: {
    [listID: string]: number;
  };
}

type ToggleSavedList = {
  type: PeakListActionType.TOGGLE_SAVED_LIST;
  payload: string;
};

type SetCompletedPeaks = {
  type: PeakListActionType.SET_COMPLETED_PEAKS;
  payload: number[];
};

type SetListCounts = {
  type: PeakListActionType.SET_LIST_COUNTS;
  payload: { [listId: string]: number };
};

type PeakListAction = ToggleSavedList | SetCompletedPeaks | SetListCounts;

interface IPeakListContext {
  state: IPeakListState;
  dispatch: React.Dispatch<PeakListAction>;
  getPeakListById: (listID: string) => IPeakList | undefined;
  isPeakCompleted: (peakID: number) => boolean;
  setCompletedPeaks: (logEntries: ILogEntry[]) => void;
  getPeakNames: (peakIds: number[]) => (string | undefined)[];
  getMatchingListIds: (peakId: number) => string[];
  calculateListCounts: () => void;
  getListTitleById: (listID: string) => string | undefined;
  getLogListIds: (peakIds: number[]) => string[];
  getPeakById: (peakId: number) => IPeak | undefined;
}

const peakListContext = createContext<IPeakListContext | null>(null);

const initialState = {
  allPeakLists: peakListsArr,
  savedListIds: ["nh4k", "adk46"],
  completedPeaks: [],
  listCounts: {},
};

const peakListReducer = (state: IPeakListState, action: PeakListAction) => {
  if (action.type === PeakListActionType.TOGGLE_SAVED_LIST) {
    const listID = action.payload;
    let newListIds;
    if (state.savedListIds.some((savedID) => savedID === listID)) {
      newListIds = state.savedListIds.filter((savedId) => savedId !== listID);
    } else {
      newListIds = [...state.savedListIds, listID];
    }
    return { ...state, savedListIds: newListIds };
  }
  if (action.type === PeakListActionType.SET_COMPLETED_PEAKS) {
    return { ...state, completedPeaks: action.payload };
  }
  if (action.type === PeakListActionType.SET_LIST_COUNTS) {
    return { ...state, listCounts: action.payload };
  }
  return { ...state };
};

export const PeakListProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(peakListReducer, initialState);

  const getPeakListById = (listID: string) => {
    const list = state.allPeakLists.find((list) => list.listID === listID);
    return list;
  };

  const isPeakCompleted = (peakID: number) => {
    return state.completedPeaks.includes(peakID);
  };

  const setCompletedPeaks = (logEntries: ILogEntry[]) => {
    const uniquePeaksArr = [
      ...new Set(logEntries.flatMap((entry) => entry.peakIds)),
    ];
    dispatch({
      type: PeakListActionType.SET_COMPLETED_PEAKS,
      payload: uniquePeaksArr,
    });
  };

  const getAllUniquePeaks = () => {
    return [
      ...new Set(state.allPeakLists.flatMap((peakList) => peakList.peaks)),
    ];
  };

  const getMatchingListIds = (peakID: number) => {
    const listMatchIds: string[] = [];
    state.allPeakLists.forEach((peakList) => {
      if (peakList.peaks.some((peak) => peak.id === peakID)) {
        listMatchIds.push(peakList.listID);
      }
    });
    return listMatchIds;
  };

  const getLogListIds = (peakIds: number[]) => {
    return [
      ...new Set(peakIds.flatMap((peakId) => getMatchingListIds(peakId))),
    ];
  };

  const getPeakNames = (peakIdsArr: number[]) => {
    const uniquePeaks = getAllUniquePeaks();
    const peakNamesArr = peakIdsArr.map((peakId) => {
      const peakMatch = uniquePeaks.find((peak) => peak.id === peakId);
      return peakMatch?.name;
    });
    return peakNamesArr;
  };

  const calculateListCounts = () => {
    const listCounts: { [listID: string]: number } = {};
    state.allPeakLists.forEach((peakList) => {
      listCounts[peakList.listID] = 0;
    });
    state.completedPeaks.forEach((peakID) => {
      const listMatchIds = getMatchingListIds(peakID);
      listMatchIds.forEach((listID) => {
        listCounts[listID]++;
      });
    });
    dispatch({ type: PeakListActionType.SET_LIST_COUNTS, payload: listCounts });
  };

  const getListTitleById = (listID: string) => {
    const listMatch = state.allPeakLists.find((list) => list.listID === listID);
    return listMatch?.title;
  };

  const getPeakById = (peakId: number) => {
    const uniquePeaks = getAllUniquePeaks();
    return uniquePeaks.find((peak) => peak.id === peakId);
  };

  const contextValue = useMemo(() => {
    return {
      state,
      dispatch,
      getPeakListById,
      setCompletedPeaks,
      isPeakCompleted,
      getPeakNames,
      getMatchingListIds,
      calculateListCounts,
      getListTitleById,
      getLogListIds,
      getPeakById,
    };
  }, [
    state,
    dispatch,
    getPeakListById,
    setCompletedPeaks,
    isPeakCompleted,
    getPeakNames,
    getMatchingListIds,
    calculateListCounts,
    getListTitleById,
    getLogListIds,
    getPeakById,
  ]);

  return (
    <peakListContext.Provider value={contextValue}>
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
