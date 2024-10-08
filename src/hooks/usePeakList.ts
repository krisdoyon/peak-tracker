import { useGetListsQuery } from "features/apiSlice";

export const usePeakList = (listId: string) => {
  const { data, isLoading, error } = useGetListsQuery();

  const list = data?.find((list) => list.listId === listId);

  return {
    data: list,
    isLoading,
    error,
  };
};
