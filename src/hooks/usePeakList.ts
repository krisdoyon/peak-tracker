import { useGetListsQuery } from "features/apiSlice";

export const usePeakList = (listId: string) => {
  return useGetListsQuery(undefined, {
    selectFromResult: ({ data, isLoading, error }) => {
      return {
        data: data?.find((list) => list.listId === listId),
        isLoading,
        error,
      };
    },
  });
};
