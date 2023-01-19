import { useContext, createContext, useReducer, useMemo } from "react";
import { ILogEntry } from "models/interfaces";
import { testLogEntries } from "assets/testLogEntries";
import { NewEntryActionKind, useNewEntryContext } from "./newEntryContext";
import { usePeakListContext } from "./peakListContext";

interface Props {
  children: React.ReactNode;
}

interface ILogContext {
  state: LogState;
  dispatch: React.Dispatch<LogAction>;
  getLogEntryById: (logID: string) => ILogEntry | undefined;
  addLogEntry: (logID: string) => boolean;
  filterLogEntries: (filter: {
    listID: string;
    month: string;
    year: string;
  }) => ILogEntry[];
  getFilterSelectOptions: () => {
    lists: { listID: string; title: string | undefined }[];
    months: { alpha: string; numeric: string }[];
    years: string[];
  };
  setLogEntryId: () => string;
  getCompletedDate: (peakId: number) => string | undefined;
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
  const {
    state: {
      checkedPeaks,
      elevation,
      distance,
      minutes,
      hours,
      notes,
      rating,
      date,
    },
    dispatch: newEntryDispatch,
  } = useNewEntryContext();
  const {
    state: { listCounts },
    getLogListIds,
    getListTitleById,
  } = usePeakListContext();

  const setLogEntryId = () => {
    const logID =
      state.logEntries.length > 0
        ? Math.max(...state.logEntries.map((entry) => +entry.logID)) + 1
        : 1;
    return logID.toString();
  };

  const getLogStats = () => {
    const time =
      hours || minutes
        ? Math.round(((hours || 0) + (minutes || 0) / 60) * 10) / 10
        : null;
    const avgSpeed =
      distance && time ? Math.round((distance / time) * 10) / 10 : null;
    const avgElevation =
      elevation && distance ? Math.round(elevation / distance) : null;
    return { time, avgSpeed, avgElevation };
  };

  const addLogEntry = (logID: string) => {
    const { time, avgSpeed, avgElevation } = getLogStats();
    const newEntry: ILogEntry = {
      logID,
      peakIds: checkedPeaks,
      stats: {
        elevation: elevation || null,
        distance: distance || null,
        minutes: minutes || null,
        hours: hours || null,
        time,
        avgSpeed,
        avgElevation,
      },
      notes: notes || null,
      rating: rating || null,
      date,
    };
    if (!date) {
      alert("Please enter a complete date in the format MM-DD-YYY");
      return false;
    }
    if (
      +date.slice(0, 4) < 1900 ||
      new Date(date).getTime() > new Date().getTime()
    ) {
      alert(`Please enter a date between 01-01-1900 and today`);
      return false;
    }
    if (checkedPeaks.length === 0) {
      alert("Please choose at least one peak from a list");
      return false;
    }
    dispatch({ type: LogActionKind.ADD_ENTRY, payload: newEntry });
    newEntryDispatch({ type: NewEntryActionKind.RESET_FORM });
    return true;
  };

  const getLogEntryById = (logID: string) => {
    const entry = state.logEntries.find((entry) => entry.logID === logID);
    return entry;
  };

  const filterLogEntries = (filters: {
    listID: string;
    month: string;
    year: string;
  }) => {
    let filteredEntries = state.logEntries;
    if (filters.listID !== "all") {
      filteredEntries = filteredEntries.filter((entry) => {
        const listMatchIds = getLogListIds(entry.peakIds);
        return listMatchIds.some((listID) => listID === filters.listID);
      });
    }
    if (filters.month !== "all") {
      filteredEntries = filteredEntries.filter((entry) => {
        const month = new Intl.DateTimeFormat("en-US", {
          month: "numeric",
        }).format(new Date(`${entry.date}T00:00:00`));
        return month === filters.month;
      });
    }
    if (filters.year !== "all") {
      filteredEntries = filteredEntries.filter((entry) => {
        const year = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
        }).format(new Date(`${entry.date}T00:00:00`));
        return year === filters.year;
      });
    }
    return filteredEntries.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const getFilterSelectOptions = () => {
    const lists: { listID: string; title: string }[] = [];
    const years: string[] = [];
    const months: { alpha: string; numeric: string }[] = [];
    for (const listID in listCounts) {
      if (listCounts[listID] !== 0) {
        const title = getListTitleById(listID)!;
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
    years.sort((a, b) => +b - +a);
    lists.sort((a, b) => a.title.localeCompare(b.title));
    return { lists, months, years };
  };

  const getCompletedDate = (peakId: number) => {
    const dateMatches = state.logEntries
      .filter((entry) => entry.peakIds.includes(peakId))
      .map((entry) => entry.date);
    const mostRecent = dateMatches.reduce((max, cur) => {
      if (cur.localeCompare(max) > 0) {
        return cur;
      } else {
        return max;
      }
    }, dateMatches[0]);

    if (mostRecent) {
      return new Intl.DateTimeFormat("en-us", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }).format(new Date(`${mostRecent}T00:00`));
    }
  };

  const contextValue = useMemo(() => {
    return {
      dispatch,
      state,
      getLogEntryById,
      addLogEntry,
      filterLogEntries,
      getFilterSelectOptions,
      setLogEntryId,
      getCompletedDate,
    };
  }, [
    dispatch,
    state,
    addLogEntry,
    getLogEntryById,
    filterLogEntries,
    getFilterSelectOptions,
    setLogEntryId,
    getCompletedDate,
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
