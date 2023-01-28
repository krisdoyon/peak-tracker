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
  openPopupId: number | null;
}

export enum MapActionType {
  SET_PEAKS,
  SET_LIST_ID,
  CLEAR_MAP,
  OPEN_POPUP,
  CLOSE_POPUP,
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

type OpenPopup = {
  type: MapActionType.OPEN_POPUP;
  payload: number;
};

type ClosePopup = {
  type: MapActionType.CLOSE_POPUP;
};

type MapAction = SetPeaks | SetListID | ClearMap | OpenPopup | ClosePopup;

const mapContext = createContext<IMapContext | null>(null);

const initialState: IMapState = {
  peaks: [],
  listID: "",
  openPopupId: null,
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
  if (action.type === MapActionType.OPEN_POPUP) {
    return { ...state, openPopupId: action.payload };
  }
  if (action.type === MapActionType.CLOSE_POPUP) {
    return { ...state, openPopupId: null };
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
