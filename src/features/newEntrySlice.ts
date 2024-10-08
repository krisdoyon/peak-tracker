import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ILogEntry } from "models/interfaces";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

interface INewEntryState {
  tripType: TripType;
  date: string;
  listId: string;
  checkedPeaks: number[];
  isStatOpen: {
    elevation: boolean;
    distance: boolean;
    time: boolean;
  };
  stats: {
    elevation: number | "";
    distance: number | "";
    hours: number | "";
    minutes: number | "";
  };
  notes: string;
  rating: number;
  filledStar: number;
  isEditing: boolean;
  editLogId: number | null;
  hasUnsavedChanges: boolean;
}

const initialState: INewEntryState = {
  tripType: TripType.COMPLETED,
  date: "",
  listId: "",
  checkedPeaks: [],
  isStatOpen: {
    elevation: false,
    distance: false,
    time: false,
  },
  stats: {
    elevation: "",
    distance: "",
    hours: "",
    minutes: "",
  },
  notes: "",
  rating: 0,
  filledStar: 0,
  isEditing: false,
  editLogId: null,
  hasUnsavedChanges: false,
};

const newEntrySlice = createSlice({
  name: "newEntry",
  initialState,
  reducers: {
    updateTripType: (state, action: PayloadAction<TripType>) => {
      state.tripType = action.payload;
    },
    updateDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
      state.hasUnsavedChanges = true;
    },
    updateListId: (state, action: PayloadAction<string>) => {
      state.listId = action.payload;
    },
    toggleCheckedPeak: (
      state,
      action: PayloadAction<{ peakId: number; checked: boolean }>
    ) => {
      const { peakId, checked } = action.payload;
      if (checked) {
        state.checkedPeaks = [...state.checkedPeaks, peakId];
      } else {
        state.checkedPeaks = state.checkedPeaks.filter(
          (checkedId) => checkedId !== peakId
        );
      }
      state.hasUnsavedChanges = true;
    },
    toggleStatOpen: (
      state,
      action: PayloadAction<keyof INewEntryState["isStatOpen"]>
    ) => {
      const input = action.payload;
      state.isStatOpen[input] = !state.isStatOpen[input];
    },
    updateStat: (
      state,
      action: PayloadAction<{
        stat: keyof INewEntryState["stats"];
        value: number;
      }>
    ) => {
      const { stat, value } = action.payload;
      state.stats[stat] = value;
      state.hasUnsavedChanges = true;
    },
    updateNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
      state.hasUnsavedChanges = true;
    },
    updateFilledStar: (state, action: PayloadAction<number>) => {
      state.filledStar = action.payload;
      state.hasUnsavedChanges = true;
    },
    updateRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
      state.hasUnsavedChanges = true;
    },
    resetRating: (state) => {
      state.rating = 0;
      state.filledStar = 0;
      state.hasUnsavedChanges = true;
    },
    loadEntry: (state, action: PayloadAction<ILogEntry>) => {
      const logEntry = action.payload;
      state.tripType = logEntry.tripType;
      state.date = logEntry.date;
      state.stats = {
        elevation: logEntry.stats.elevation,
        distance: logEntry.stats.distance,
        hours: logEntry.stats.hours,
        minutes: logEntry.stats.minutes,
      };
      state.isStatOpen = {
        elevation: logEntry.stats.elevation ? true : false,
        distance: logEntry.stats.distance ? true : false,
        time: logEntry.stats.hours || logEntry.stats.minutes ? true : false,
      };
      state.checkedPeaks = logEntry?.peakIds || [];
      state.rating = logEntry.rating || 0;
      state.filledStar = logEntry.rating || 0;
      state.notes = logEntry.notes;
      state.isEditing = true;
      state.editLogId = +logEntry.logId;
    },
    resetForm: () => initialState,
  },
});

export const {
  updateTripType,
  updateDate,
  updateListId,
  toggleCheckedPeak,
  updateStat,
  toggleStatOpen,
  updateNotes,
  updateFilledStar,
  updateRating,
  resetForm,
  resetRating,
  loadEntry,
} = newEntrySlice.actions;

export default newEntrySlice.reducer;
