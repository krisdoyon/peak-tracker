import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IFilterState {
  listId: string;
  year: string;
  month: string;
}

const initialState: IFilterState = {
  listId: "all",
  year: "all",
  month: "all",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    updateFilters: (
      state,
      action: PayloadAction<{ filter: keyof IFilterState; value: string }>
    ) => {
      const { filter, value } = action.payload;
      state[filter] = value;
    },
  },
});

export const { updateFilters } = filterSlice.actions;

export default filterSlice.reducer;
