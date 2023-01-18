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
}

export enum MapActionType {
  PLOT_PEAKS,
}

type PlotPeaks = {
  type: MapActionType.PLOT_PEAKS;
  payload: IPeak[] | undefined;
};

type MapAction = PlotPeaks;

const mapContext = createContext<IMapContext | null>(null);

const initialState: IMapState = {
  peaks: [],
};

const mapReducer = (state: IMapState, action: MapAction) => {
  if (action.type === MapActionType.PLOT_PEAKS) {
    const newPeaks = action.payload || [];
    return { ...state, peaks: newPeaks };
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
