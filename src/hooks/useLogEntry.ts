import { useGetLogEntriesQuery } from "features/apiSlice";

export const useLogEntry = (logID: string, userId: string) => {
  const { data, isLoading, error } = useGetLogEntriesQuery(userId, {
    selectFromResult: ({ data, error, isLoading }) => {
      return {
        data: data?.find((entry) => entry.logID === logID),
        error,
        isLoading,
      };
    },
  });
  return {
    data,
    isLoading,
    error,
  };
};
