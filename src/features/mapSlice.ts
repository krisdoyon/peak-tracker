import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPeak } from "models/interfaces";

interface IMapState {
  peaks: IPeak[];
  listId: string | null;
  openPopupId: number | null;
}

const initialState: IMapState = {
  peaks: [],
  listId: null,
  openPopupId: null,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    plotList: (
      state,
      action: PayloadAction<{ peaks: IPeak[]; listId: string }>
    ) => {
      const { peaks, listId } = action.payload;
      state.peaks = peaks;
      state.listId = listId;
    },
    plotLogEntry: (state, action: PayloadAction<IPeak[]>) => {
      state.peaks = action.payload;
      state.listId = null;
    },
    openPopup: (state, action: PayloadAction<number>) => {
      state.openPopupId = action.payload;
    },
    closePopup: (state) => {
      state.openPopupId = null;
    },
    clearMap: () => initialState,
  },
});

export const { plotList, plotLogEntry, openPopup, closePopup, clearMap } =
  mapSlice.actions;

export default mapSlice.reducer;
