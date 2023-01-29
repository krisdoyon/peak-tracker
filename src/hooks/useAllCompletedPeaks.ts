import { createSelector } from "@reduxjs/toolkit";
import { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useGetLogEntriesQuery } from "features/apiSlice";
import { ILogEntry, IPeak } from "models/interfaces";
import { useMemo } from "react";

const USER_Id = "abc123";

export const useAllCompletedPeaks = () => {
  const selectCompletedPeaks = useMemo(() => {
    return createSelector(
      (res: UseQueryHookResult<any, any>) => res.data,
      (data: ILogEntry[]) => [
        ...new Set(data?.flatMap((entry: any) => entry.peakIds)),
      ]
    );
  }, []);
  const { data: completedPeaks } = useGetLogEntriesQuery(USER_Id, {
    selectFromResult: (res) => ({
      data: selectCompletedPeaks(res),
    }),
  });
  return completedPeaks;
};
