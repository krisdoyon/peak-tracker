import axios from "axios";
import { ILogEntry } from "models/interfaces";
import { useQuery } from "react-query";

const API_URL =
  "https://peak-tracker-5856f-default-rtdb.firebaseio.com/users/abc123/logEntries.json";

export const useLogEntriesQuery = () => {
  const getLogEntries = async () => {
    const { data } = await axios<ILogEntry[]>(API_URL);
    return data.filter((entry) => entry != null);
  };

  const { data, isLoading, isError } = useQuery("logEntries", getLogEntries, {
    staleTime: Infinity,
  });

  return { allLogEntries: data ?? [], isLoading, isError };
};
