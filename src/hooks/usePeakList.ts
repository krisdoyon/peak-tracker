import { useGetListsQuery } from "features/apiSlice";

export const usePeakList = (listID: string) => {
  return useGetListsQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => {
      return {
        data: data?.find((list) => list.listID === listID),
        isLoading,
        error,
      };
    },
  });
};
