import { useLogEntriesQuery } from "./useLogEntriesQuery";

export const useLogEntry = (logID: string) => {
  const { allLogEntries, isLoading, isError } = useLogEntriesQuery();
  return {
    logEntry: allLogEntries.find((entry) => entry.logID === logID),
    isLoading,
    isError,
  };
};
