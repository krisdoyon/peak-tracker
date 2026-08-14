import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IDialogState {
  dialogUnsavedChangesOpen: boolean;
}

const initialState: IDialogState = {
  dialogUnsavedChangesOpen: false,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    updateFilters: (
      state,
      action: PayloadAction<{ filter: keyof IDialogState; value: boolean }>
    ) => {
      const { filter, value } = action.payload;
      state[filter] = value;
    },
  },
});

export const { updateFilters } = dialogSlice.actions;

export default dialogSlice.reducer;
