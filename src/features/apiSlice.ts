import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { testLogEntries } from "assets/testLogEntries";
import { ILogEntry, IPeakList } from "models/interfaces";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["savedLists", "logEntries"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://peak-tracker-5856f-default-rtdb.firebaseio.com",
  }),
  endpoints: (builder) => ({
    getLists: builder.query<IPeakList[], void>({
      query: () => "/lists.json",
      transformResponse: (res: IPeakList[]) =>
        res.sort((a, b) => a.title.localeCompare(b.title)) ?? [],
    }),
    getLogEntries: builder.query<ILogEntry[], string>({
      query: (userId) => `/users/${userId}/logEntries.json`,
      transformResponse: (res: ILogEntry[]) => {
        if (res === null) return [];
        return Object.keys(res)
          .map((key) => res[+key])
          .filter((entry) => entry != null);
      },
      providesTags: ["logEntries"],
    }),
    getSavedLists: builder.query<string[], string>({
      query: (userId) => `/users/${userId}/savedLists.json`,
      transformResponse: (res: string[]) => res ?? [],
      providesTags: ["savedLists"],
    }),
    updateSavedLists: builder.mutation<
      void,
      { userId: string; savedLists: string[] }
    >({
      query: ({ userId, savedLists }) => ({
        url: `/users/${userId}/savedLists.json`,
        method: "PUT",
        body: savedLists,
      }),
      invalidatesTags: ["savedLists"],
      async onQueryStarted(
        { userId, savedLists },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getSavedLists", userId, () => {
            return savedLists;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    addLogEntry: builder.mutation<
      void,
      { userId: string; newEntry: ILogEntry }
    >({
      query: ({ userId, newEntry }) => ({
        url: `/users/${userId}/logEntries/${newEntry.logID}.json`,
        method: "PUT",
        body: newEntry,
      }),
      invalidatesTags: ["logEntries"],
      async onQueryStarted({ userId, newEntry }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getLogEntries", userId, (draft) => {
            return [...draft, newEntry];
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeLogEntry: builder.mutation<void, { userId: string; logId: string }>({
      query: ({ userId, logId }) => ({
        url: `/users/${userId}/logEntries/${logId}.json`,
        method: "DELETE",
      }),
      invalidatesTags: ["logEntries"],
      async onQueryStarted({ userId, logId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getLogEntries", userId, (draft) => {
            return draft.filter((entry) => entry.logID !== logId);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    setTestLogEntries: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}/logEntries.json`,
        method: "PUT",
        body: testLogEntries,
      }),
      invalidatesTags: ["logEntries"],
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getLogEntries", userId, (draft) => {
            return testLogEntries;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetListsQuery,
  useGetLogEntriesQuery,
  useGetSavedListsQuery,
  useUpdateSavedListsMutation,
  useRemoveLogEntryMutation,
  useAddLogEntryMutation,
  useSetTestLogEntriesMutation,
} = apiSlice;
