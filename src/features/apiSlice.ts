import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { testLogEntries } from "assets/testLogEntries";
import { ILogEntry, IPeakList } from "models/interfaces";
import { API_URL, SIGNUP_URL, LOGIN_URL } from "assets/config";

type userId = string | null;
type token = string | null;

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["savedLists", "logEntries"],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),
  endpoints: (builder) => ({
    getLists: builder.query<IPeakList[], void>({
      query: () => "/lists.json",
      transformResponse: (res: IPeakList[]) =>
        res.sort((a, b) => a.title.localeCompare(b.title)) ?? [],
    }),
    getPeaks: builder.query<IPeak[], void>({
      query: () => "/peaks.json",
      transformResponse: (res: IPeak[]) => res ?? [],
    }),
    getLogEntries: builder.query<
      ILogEntry[],
      { userId: userId; token: token; tripType?: TripType }
    >({
        query: ({ userId, token }) =>
          `/users/${userId}/logEntries.json?auth=${token}`,
        transformResponse: (res: ILogEntry[]) => {
          if (res === null) return [];
          return Object.keys(res)
            .map((key) => res[+key])
            .filter((entry) => entry != null);
        },
        providesTags: ["logEntries"],
      }
    ),
    getSavedLists: builder.query<string[], { userId: userId; token: token }>({
      query: ({ userId, token }) =>
        `/users/${userId}/savedLists.json?auth=${token}`,
      transformResponse: (res: string[]) => res ?? [],
      providesTags: ["savedLists"],
    }),
    updateSavedLists: builder.mutation<
      void,
      { userId: userId; token: token; savedLists: string[] }
    >({
      query: ({ userId, token, savedLists }) => ({
        url: `/users/${userId}/savedLists.json?auth=${token}`,
        method: "PUT",
        body: savedLists,
      }),
      invalidatesTags: ["savedLists"],
      async onQueryStarted(
        { userId, token, savedLists },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getSavedLists",
            { userId, token },
            () => {
              return savedLists;
            }
          )
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
      { userId: userId; token: token; newEntry: ILogEntry }
    >({
      query: ({ userId, token, newEntry }) => ({
        url: `/users/${userId}/logEntries/${newEntry.logId}.json?auth=${token}`,
        method: "PUT",
        body: newEntry,
      }),
      invalidatesTags: ["logEntries"],
      async onQueryStarted(
        { userId, token, newEntry },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getLogEntries",
            { userId, token },
            (draft) => {
              return [...draft, newEntry];
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    removeLogEntry: builder.mutation<
      void,
      { userId: userId; logId: string; token: token }
    >({
      query: ({ userId, logId, token }) => ({
        url: `/users/${userId}/logEntries/${logId}.json?auth=${token}`,
        method: "DELETE",
      }),
      invalidatesTags: ["logEntries"],
      async onQueryStarted(
        { userId, token, logId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getLogEntries",
            { userId, token },
            (draft) => {
              return draft.filter((entry) => entry.logId !== logId);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    setTestLogEntries: builder.mutation<void, { userId: userId; token: token }>(
      {
        query: ({ userId, token }) => ({
          url: `/users/${userId}/logEntries.json?auth=${token}`,
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
      }
    ),
    sendAuthRequest: builder.mutation<
      void,
      { email: string; password: string; requestType: "signup" | "login" }
    >({
      query: ({ email, password, requestType }) => ({
        // url: "https://test.",
        url: requestType === "signup" ? SIGNUP_URL : LOGIN_URL,
        method: "POST",
        body: {
          email,
          password,
          returnSecureToken: true,
        },
      }),
      transformResponse: (response: any) => response,
      // transformErrorResponse: (response) => {
      //   console.log("TRANSOFRM");
      //   return response.data?.error;
      // },
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
  useSendAuthRequestMutation,
} = apiSlice;
