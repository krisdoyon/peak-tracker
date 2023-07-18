import { createSelector } from "@reduxjs/toolkit";
import { UseQueryHookResult } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useGetLogEntriesQuery } from "features/apiSlice";
import { ILogEntry, IPeak } from "models/interfaces";
import { useMemo } from "react";
import { useAppSelector } from "hooks/reduxHooks";

export const useAllCompletedPeaks = () => {
  const { userId, isLoggedIn, token } = useAppSelector((state) => state.auth);
  const selectCompletedPeaks = useMemo(() => {
    return createSelector(
      (res: UseQueryHookResult<any, any>) => res.data,
      (data: ILogEntry[]) => [
        ...new Set(data?.flatMap((entry: any) => entry.peakIds)),
      ]
    );
  }, []);
  const { data: completedPeaks = [] } = useGetLogEntriesQuery(
    { userId, token },
    {
      skip: userId === null || !isLoggedIn || token === null,
      selectFromResult: (res) => ({
        data: selectCompletedPeaks(res),
      }),
    }
  );
  return completedPeaks;
};
