import { createContext, useContext, useMemo, useReducer } from "react";

interface Props {
  children: React.ReactNode;
}

export enum NewEntryActionType {
  RESET_FORM,
  SET_DATE,
  SET_LIST_ID,
  TOGGLE_CHECKED_PEAK,
  SET_RATING,
  SET_NOTES,
  SET_STAT,
  SET_FILLED_STAR,
  SET_VALUE,
  TOGGLE_STAT_OPEN,
}

interface INewEntryState {
  date: string;
  listID: string;
  checkedPeaks: number[];
  isStatOpen: {
    elevation: boolean;
    distance: boolean;
    time: boolean;
  };
  elevation: number | "";
  distance: number | "";
  hours: number | "";
  minutes: number | "";
  notes: string;
  rating: number;
  filledStar: number;
}

interface INewEntryContext {
  state: INewEntryState;
  dispatch: React.Dispatch<NewEntryAction>;
}

type SetDate = { type: NewEntryActionType.SET_DATE; payload: string };
type SetRating = { type: NewEntryActionType.SET_RATING; payload: number };
type SetListID = { type: NewEntryActionType.SET_LIST_ID; payload: string };
type ToggleCheckedPeak = {
  type: NewEntryActionType.TOGGLE_CHECKED_PEAK;
  payload: { checked: boolean; peakID: number };
};
type SetNotes = { type: NewEntryActionType.SET_NOTES; payload: string };
type ResetForm = { type: NewEntryActionType.RESET_FORM };
type SetStat = {
  type: NewEntryActionType.SET_STAT;
  payload: {
    stat: "elevation" | "distance" | "hours" | "minutes";
    value: number;
  };
};
type SetFilledStar = {
  type: NewEntryActionType.SET_FILLED_STAR;
  payload: number;
};

type SetValue<T> = {
  type: NewEntryActionType.SET_VALUE;
  payload: { input: string; value: T };
};

type ToggleStatOpen = {
  type: NewEntryActionType.TOGGLE_STAT_OPEN;
  payload: "elevation" | "distance" | "time";
};

type NewEntryAction =
  | SetDate
  | SetRating
  | SetListID
  | ToggleCheckedPeak
  | SetNotes
  | SetStat
  | ResetForm
  | SetFilledStar
  | ToggleStatOpen;

const newEntryContext = createContext<INewEntryContext | null>(null);

function newEntryReducer(state: INewEntryState, action: NewEntryAction) {
  if (action.type === NewEntryActionType.SET_DATE) {
    return { ...state, date: action.payload };
  }
  if (action.type === NewEntryActionType.SET_LIST_ID) {
    return { ...state, listID: action.payload };
  }
  if (action.type === NewEntryActionType.TOGGLE_CHECKED_PEAK) {
    const { checked, peakID } = action.payload;
    let newCheckedPeaks;
    if (checked) {
      newCheckedPeaks = [...state.checkedPeaks, peakID];
    } else {
      newCheckedPeaks = state.checkedPeaks.filter(
        (checkedID) => checkedID !== peakID
      );
    }
    return { ...state, checkedPeaks: newCheckedPeaks };
  }
  if (action.type === NewEntryActionType.SET_RATING) {
    return { ...state, rating: action.payload };
  }
  if (action.type === NewEntryActionType.SET_NOTES) {
    return { ...state, notes: action.payload };
  }
  if (action.type === NewEntryActionType.SET_STAT) {
    let { stat, value } = action.payload;
    return { ...state, [stat]: value || "" };
  }
  if (action.type === NewEntryActionType.RESET_FORM) {
    return { ...state, ...initialState };
  }
  if (action.type === NewEntryActionType.SET_FILLED_STAR) {
    return { ...state, filledStar: action.payload };
  }
  if (action.type === NewEntryActionType.TOGGLE_STAT_OPEN) {
    const currentlyOpen = state.isStatOpen[action.payload];
    return {
      ...state,
      isStatOpen: { ...state.isStatOpen, [action.payload]: !currentlyOpen },
    };
  }

  return state;
}

const initialState: INewEntryState = {
  date: "",
  listID: "",
  checkedPeaks: [],
  isStatOpen: {
    elevation: false,
    distance: false,
    time: false,
  },
  elevation: "",
  distance: "",
  hours: "",
  minutes: "",
  notes: "",
  rating: 0,
  filledStar: 0,
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
