import axios from "axios";
import { IPeakList } from "models/interfaces";
import { useQuery } from "react-query";
import { usePeakListsQuery } from "./usePeakListsQuery";

// export const usePeak = (peakID: number) => {
//   const { allPeakLists, isLoading } = usePeakListsQuery();
//   console.log(isLoading);
//   console.log(allPeakLists);

//   const allPeaks = [
//     ...new Set(allPeakLists.flatMap((peakList) => peakList.peaks)),
//   ];

//   const peak = allPeaks.find((peak) => peak.id === peakID);

//   return peak;
// };

const API_URL =
  "https://peak-tracker-5856f-default-rtdb.firebaseio.com/lists.json";

export const usePeak = (peakID: number) => {
  const getPeakLists = async () => {
    const { data } = await axios<IPeakList[]>(API_URL);
    return data;
  };

  const { data, isLoading, isError } = useQuery("lists", getPeakLists, {
    staleTime: Infinity,
    select: (data) => {
      const uniquePeaks = data.flatMap((list) => list.peaks);
      return uniquePeaks.find((peak) => peak.id === peakID);
    },
  });

  return { peak: data, isLoading, isError };
};
