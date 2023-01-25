import { IPeak } from "models/interfaces";
import { createContext, useContext, useMemo, useReducer } from "react";

interface Props {
  children: React.ReactNode;
}

interface IMapContext {
  state: IMapState;
  dispatch: React.Dispatch<MapAction>;
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

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
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
