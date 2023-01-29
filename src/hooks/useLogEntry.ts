import { useGetLogEntriesQuery } from "features/apiSlice";

export const useLogEntry = (logId: string, userId: string) => {
  const { data, isLoading, error } = useGetLogEntriesQuery(userId, {
    selectFromResult: ({ data, error, isLoading }) => {
      return {
        data: data?.find((entry) => entry.logId === logId),
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
