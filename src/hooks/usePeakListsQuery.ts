import axios from "axios";
import { IPeakList } from "models/interfaces";
import { useQuery } from "react-query";

const API_URL =
  "https://peak-tracker-5856f-default-rtdb.firebaseio.com/lists.json";

export const usePeakListsQuery = () => {
  const getPeakLists = async () => {
    const { data } = await axios<IPeakList[]>(API_URL);
    return data;
  };

  const { data, isLoading, isError } = useQuery("lists", getPeakLists, {
    staleTime: Infinity,
  });

  return { allPeakLists: data ?? [], isLoading, isError };
};
