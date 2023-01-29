import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface INewEntryState {
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
}

const initialState: INewEntryState = {
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
};

const newEntrySlice = createSlice({
  name: "newEntry",
  initialState,
  reducers: {
    updateDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
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
    },
    updateNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    updateFilledStar: (state, action: PayloadAction<number>) => {
      state.filledStar = action.payload;
    },
    updateRating: (state, action: PayloadAction<number>) => {
      state.rating = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  updateDate,
  updateListId,
  toggleCheckedPeak,
  updateStat,
  toggleStatOpen,
  updateNotes,
  updateFilledStar,
  updateRating,
  resetForm,
} = newEntrySlice.actions;

export default newEntrySlice.reducer;
