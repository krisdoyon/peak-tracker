import { useContext, createContext, useReducer, useMemo } from "react";
import { ILogEntry } from "models/interfaces";
import { testLogEntries } from "assets/testLogEntries";

interface Props {
  children: React.ReactNode;
}

interface ILogContext {
  state: LogState;
  dispatch: React.Dispatch<LogAction>;
  getLogEntryById: (logID: string) => ILogEntry | undefined;
}

export enum LogActionKind {
  REMOVE_ENTRY = "REMOVE_ENTRY",
  ADD_ENTRY = "ADD_ENTRY",
}

interface LogState {
  logEntries: ILogEntry[];
}

interface LogAction {
  type: LogActionKind;
  payload: any;
}

const logContext = createContext<ILogContext | null>(null);

const initialState: LogState = {
  logEntries: testLogEntries,
};

const logReducer = (state: LogState, action: LogAction) => {
  if (action.type === LogActionKind.ADD_ENTRY) {
    return { ...state, logEntries: [...state.logEntries, action.payload] };
  }
  if (action.type === LogActionKind.REMOVE_ENTRY) {
    const logID = action.payload;
    const newEntries = state.logEntries.filter(
      (entry) => entry.logID !== logID
    );
    return { ...state, logEntries: newEntries };
  }
  return state;
};

export const LogProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(logReducer, initialState);

  const getLogEntryById = (logID: string) => {
    const entry = state.logEntries.find((entry) => entry.logID === logID);
    return entry;
  };

  const contextValue = useMemo(() => {
    return { dispatch, state, getLogEntryById };
  }, [dispatch, state]);

  return (
    <logContext.Provider value={contextValue}>{children}</logContext.Provider>
  );
};

export const useLogContext = () => {
  const context = useContext(logContext);
  if (context === null) {
    throw new Error("useLogContext must be used within LogProvider");
  }
  return context;
};
