import { createContext, useContext, useMemo, useReducer } from "react";

interface Props {
  children: React.ReactNode;
}

export enum NewEntryActionKind {
  SET_DATE,
  TOGGLE_CHECKED_PEAK,
  SET_LIST_ID,
  SET_RATING,
  SET_NOTES,
  SET_ELEVATION,
}

interface INewEntryState {
  date: string | undefined;
  listID: string;
  checkedPeaks: number[];
  elevation: number | undefined;
  distance: number | undefined;
  hours: number | undefined;
  minutes: number | undefined;
  notes: string | undefined;
  rating: number;
}

interface INewEntryContext {
  state: INewEntryState;
  dispatch: React.Dispatch<NewEntryAction>;
}

type SetDate = { type: NewEntryActionKind.SET_DATE; payload: string };
type SetRating = { type: NewEntryActionKind.SET_RATING; payload: number };
type SetListID = { type: NewEntryActionKind.SET_LIST_ID; payload: string };
type SetNotes = { type: NewEntryActionKind.SET_NOTES; payload: string };
type SetElevation = { type: NewEntryActionKind.SET_ELEVATION; payload: number };

type NewEntryAction = SetDate | SetRating | SetListID | SetNotes | SetElevation;

const newEntryContext = createContext<INewEntryContext | null>(null);

const newEntryReducer = (state: INewEntryState, action: NewEntryAction) => {
  if (action.type === NewEntryActionKind.SET_DATE) {
    return { ...state, date: action.payload };
  }
  if (action.type === NewEntryActionKind.SET_LIST_ID) {
    return { ...state, listID: action.payload };
  }
  if (action.type === NewEntryActionKind.SET_RATING) {
    return { ...state, rating: action.payload };
  }
  if (action.type === NewEntryActionKind.SET_NOTES) {
    return { ...state, notes: action.payload };
  }
  if (action.type === NewEntryActionKind.SET_ELEVATION) {
    return { ...state, elevation: action.payload };
  }
  return state;
};

const initialState: INewEntryState = {
  date: undefined,
  listID: "",
  checkedPeaks: [],
  elevation: undefined,
  distance: undefined,
  hours: undefined,
  minutes: undefined,
  notes: undefined,
  rating: 0,
};

export const NewEntryProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(newEntryReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <newEntryContext.Provider value={contextValue}>
      {children}
    </newEntryContext.Provider>
  );
};

export const useNewEntryContext = () => {
  const context = useContext(newEntryContext);
  if (context === null) {
    throw new Error("useNewEntryContext must be used within NewEntryProvider");
  }
  return context;
};
