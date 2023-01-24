import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILogEntry, IPeakList } from "models/interfaces";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://peak-tracker-5856f-default-rtdb.firebaseio.com",
  }),
  endpoints: (builder) => ({
    getLists: builder.query<IPeakList[], void>({
      query: () => "/lists.json",
      transformResponse: (res: IPeakList[]) =>
        res.sort((a, b) => a.title.localeCompare(b.title)),
    }),
    getLogEntries: builder.query<ILogEntry[], string>({
      query: (userId) => `/users/${userId}/logEntries.json`,
      transformResponse: (res: ILogEntry[]) =>
        res.filter((entry) => entry != null),
    }),
    getSavedLists: builder.query<string[], string>({
      query: (userId) => `/users/${userId}/savedLists.json`,
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetLogEntriesQuery,
  useGetSavedListsQuery,
} = apiSlice;
