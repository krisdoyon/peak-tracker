import axios from "axios";
import { IPeakList } from "models/interfaces";
import { useCallback } from "react";
import { useQuery } from "react-query";

const API_URL =
  "https://peak-tracker-5856f-default-rtdb.firebaseio.com/lists.json";

export const useAllPeakLists = () => {
  const getPeakLists = useCallback(async () => {
    const { data } = await axios(API_URL);
    return data;
  }, [API_URL]);

  const query = useQuery("lists", getPeakLists, {
    staleTime: Infinity,
  });
  const lists: IPeakList[] = query.data;
  return lists;
};
