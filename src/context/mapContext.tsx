import { IPeak } from "models/interfaces";
import { createContext, useContext, useMemo, useReducer } from "react";
import { useLogContext } from "./logContext";
import { usePeakListContext } from "./peakListContext";

interface Props {
  children: React.ReactNode;
}

interface IMapContext {
  state: IMapState;
  dispatch: React.Dispatch<MapAction>;
  plotPeakList: (listID: string) => void;
  plotLogEntry: (logID: string) => void;
}

interface IMapState {
  peaks: IPeak[];
  listID: string;
}

export enum MapActionType {
  SET_PEAKS,
  SET_LIST_ID,
  CLEAR_MAP,
}

type SetPeaks = {
  type: MapActionType.SET_PEAKS;
  payload: IPeak[] | undefined;
};

type SetListID = {
  type: MapActionType.SET_LIST_ID;
  payload: string;
};

type ClearMap = {
  type: MapActionType.CLEAR_MAP;
};

type MapAction = SetPeaks | SetListID | ClearMap;

const mapContext = createContext<IMapContext | null>(null);

const initialState: IMapState = {
  peaks: [],
  listID: "",
};

const mapReducer = (state: IMapState, action: MapAction) => {
  if (action.type === MapActionType.SET_PEAKS) {
    return { ...state, peaks: action.payload || [] };
  }
  if (action.type === MapActionType.SET_LIST_ID) {
    return { ...state, listID: action.payload };
  }
  if (action.type === MapActionType.CLEAR_MAP) {
    return { ...state, peaks: [] };
  }
  return { ...state };
};

export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, initialState);

  const { getPeakListById, getPeakById } = usePeakListContext();

  const { getLogEntryById } = useLogContext();

  const plotPeakList = (listID: string) => {
    const peaks = getPeakListById(listID)?.peaks;
    dispatch({
      type: MapActionType.SET_PEAKS,
      payload: peaks,
    });
    dispatch({
      type: MapActionType.SET_LIST_ID,
      payload: listID,
    });
  };

  const plotLogEntry = (logID: string) => {
    const entry = getLogEntryById(logID)!;
    const peaksArr = entry.peakIds.map((peakID) => {
      return getPeakById(peakID)!;
    });
    dispatch({ type: MapActionType.SET_PEAKS, payload: peaksArr });
  };

  const contextValue = useMemo(() => {
    return { state, dispatch, plotPeakList, plotLogEntry };
  }, [state, dispatch, plotPeakList, plotLogEntry]);
  return (
    <mapContext.Provider value={contextValue}>{children}</mapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(mapContext);
  if (context === null) {
    throw new Error("useMapContext must be used within MapProvider");
  }
  return context;
};
