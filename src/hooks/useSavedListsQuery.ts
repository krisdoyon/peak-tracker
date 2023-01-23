import axios from "axios";
import { useQuery } from "react-query";

const API_URL =
  "https://peak-tracker-5856f-default-rtdb.firebaseio.com/users/abc123/savedLists.json";

export const useSavedListsQuery = () => {
  const getSavedLists = async () => {
    const { data } = await axios<string[]>(API_URL);
    return data.filter((entry) => entry != null);
  };

  const { data, isLoading, isError } = useQuery("savedLists", getSavedLists, {
    staleTime: Infinity,
  });

  return { savedLists: data ?? [], isLoading, isError };
};
