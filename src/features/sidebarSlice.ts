import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISidebarState {
  sidebarOpen: boolean;
}

const initialState: ISidebarState = {
  sidebarOpen: true,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
