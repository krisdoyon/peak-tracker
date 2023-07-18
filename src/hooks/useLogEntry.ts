import { useGetLogEntriesQuery } from "features/apiSlice";
import { useAppSelector } from "./reduxHooks";

export const useLogEntry = (logId: string) => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const { data, isLoading, error } = useGetLogEntriesQuery(
    { userId, token },
    {
      skip: userId === null || !isLoggedIn || token === null,
      selectFromResult: ({ data, error, isLoading }) => {
        return {
          data: data?.find((entry) => entry.logId === logId),
          error,
          isLoading,
        };
      },
    }
  );
  return {
    data,
    isLoading,
    error,
  };
};
