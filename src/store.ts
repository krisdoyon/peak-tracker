import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "features/apiSlice";
import mapReducer from "features/mapSlice";
import filtersReducer from "features/filtersSlice";
import sidebarReducer from "features/sidebarSlice";
import newEntryReducer from "features/newEntrySlice";
import modalReducer from "features/modalSlice";
import authReducer from "features/authSlice";
import dialogReducer from "features/dialogSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
    filters: filtersReducer,
    sidebar: sidebarReducer,
    newEntry: newEntryReducer,
    modal: modalReducer,
    auth: authReducer,
    dialog: dialogReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
