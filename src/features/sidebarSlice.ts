import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavLinksEnum } from "layout/Sidebar/navLinks";
import { navLinks } from "layout/Sidebar/navLinks";

const getActiveNavLink = () => {
  const pathname = window.location.pathname;
  const matchingLink = navLinks.find((link) => link.to === pathname);
  return matchingLink?.active || NavLinksEnum.MAP;
};

interface ISidebarState {
  sidebarOpen: boolean;
  activeNav: NavLinksEnum;
}

const initialState: ISidebarState = {
  sidebarOpen: true,
  activeNav: getActiveNavLink(),
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setActiveNav: (state, action: PayloadAction<NavLinksEnum>) => {
      state.activeNav = action.payload;
    },
  },
});

export const { toggleSidebar, setActiveNav } = sidebarSlice.actions;

export default sidebarSlice.reducer;
