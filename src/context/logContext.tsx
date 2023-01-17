import { useContext, createContext, useReducer, useMemo } from "react";
import { ILogEntry } from "models/interfaces";
import { testLogEntries } from "assets/testLogEntries";
import { useNewEntryContext } from "./newEntryContext";
import { usePeakListContext } from "./peakListContext";

interface Props {
  children: React.ReactNode;
}

interface ILogContext {
  state: LogState;
  dispatch: React.Dispatch<LogAction>;
  getLogEntryById: (logID: string) => ILogEntry | undefined;
  addLogEntry: () => void;
  filterLogEntries: () => ILogEntry[];
  getFilterSelectOptions: () => {
    lists: { listID: string; title: string | undefined }[];
    months: { alpha: string; numeric: string }[];
    years: string[];
  };
}

export enum LogActionKind {
  REMOVE_ENTRY,
  ADD_ENTRY,
  UPDATE_FILTERS,
}

interface LogState {
  logEntries: ILogEntry[];
  filters: {
    listID: string;
    month: string;
    year: string;
  };
}

type RemoveLogEntry = {
  type: LogActionKind.REMOVE_ENTRY;
  payload: string;
};

type AddLogEntry = {
  type: LogActionKind.ADD_ENTRY;
  payload: ILogEntry;
};

type UpdateFilters = {
  type: LogActionKind.UPDATE_FILTERS;
  payload: {
    filter: "listID" | "month" | "year";
    value: string;
  };
};

type LogAction = AddLogEntry | RemoveLogEntry | UpdateFilters;

const logContext = createContext<ILogContext | null>(null);

const initialState: LogState = {
  logEntries: testLogEntries,
  filters: {
    listID: "all",
    month: "all",
    year: "all",
  },
};

const logReducer = (state: LogState, action: LogAction) => {
  if (action.type === LogActionKind.ADD_ENTRY) {
    console.log(action.payload);
    return { ...state, logEntries: [...state.logEntries, action.payload] };
  }
  if (action.type === LogActionKind.REMOVE_ENTRY) {
    const logID = action.payload;
    const newEntries = state.logEntries.filter(
      (entry) => entry.logID !== logID
    );
    return { ...state, logEntries: newEntries };
  }
  if (action.type === LogActionKind.UPDATE_FILTERS) {
    const { filter, value } = action.payload;
    return { ...state, filters: { ...state.filters, [filter]: value } };
  }
  return state;
};

export const LogProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(logReducer, initialState);
  const { state: newEntryState } = useNewEntryContext();
  const {
    state: { listCounts },
    getLogListIds,
    getListTitleById,
  } = usePeakListContext();

  const addLogEntry = () => {
    const newEntry = {
      logID: "55",
      peakIds: [],
      stats: {
        elevation: 3,
        distance: 3,
        minutes: 3,
        hours: 3,
        time: 3,
        avgSpeed: 3,
        avgElevation: 3,
      },
      notes: "",
      rating: 3,
      date: "",
    };
    if (newEntryState.checkedPeaks.length === 0) {
      alert("Please choose at least one peak from a list");
      return;
    }
    console.log(newEntry);
    dispatch({ type: LogActionKind.ADD_ENTRY, payload: newEntry });
  };

  const getLogEntryById = (logID: string) => {
    const entry = state.logEntries.find((entry) => entry.logID === logID);
    return entry;
  };

  const filterLogEntries = () => {
    let filteredEntries = state.logEntries;
    if (state.filters.listID !== "all") {
      filteredEntries = filteredEntries.filter((entry) => {
        const listMatchIds = getLogListIds(entry.peakIds);
        return listMatchIds.some((listID) => listID === state.filters.listID);
      });
    }
    if (state.filters.month !== "all") {
      filteredEntries = filteredEntries.filter((entry) => {
        const month = new Intl.DateTimeFormat("en-US", {
          month: "numeric",
        }).format(new Date(`${entry.date}T00:00:00`));
        return month === state.filters.month;
      });
    }
    if (state.filters.year !== "all") {
      filteredEntries = filteredEntries.filter((entry) => {
        const year = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
        }).format(new Date(`${entry.date}T00:00:00`));
        return year === state.filters.year;
      });
    }
    return filteredEntries;
  };

  const getFilterSelectOptions = () => {
    const lists: { listID: string; title: string | undefined }[] = [];
    const years: string[] = [];
    const months: { alpha: string; numeric: string }[] = [];
    for (const listID in listCounts) {
      if (listCounts[listID] !== 0) {
        const title = getListTitleById(listID);
        lists.push({ listID, title });
      }
    }
    for (const entry of state.logEntries) {
      const date = new Date(`${entry.date}T00:00:00`);
      const alpha = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        date
      );
      const numeric = new Intl.DateTimeFormat("en-US", {
        month: "numeric",
      }).format(date);
      const entryYear = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
      }).format(date);
      if (!months.some((monthObj) => monthObj.alpha === alpha)) {
        months.push({ alpha, numeric });
      }
      if (!years.some((year) => year === entryYear)) {
        years.push(entryYear);
      }
    }
    months.sort((a, b) => +a.numeric - +b.numeric);
    return { lists, months, years };
  };

  const contextValue = useMemo(() => {
    return {
      dispatch,
      state,
      getLogEntryById,
      addLogEntry,
      filterLogEntries,
      getFilterSelectOptions,
    };
  }, [
    dispatch,
    state,
    addLogEntry,
    getLogEntryById,
    filterLogEntries,
    getFilterSelectOptions,
  ]);

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
