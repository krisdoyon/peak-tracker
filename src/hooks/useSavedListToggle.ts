import {
  useGetSavedListsQuery,
  useUpdateSavedListsMutation,
} from "features/apiSlice";

const USER_Id = "abc123";

export const useSavedListToggle = (listId: string) => {
  const { data: savedLists = [] } = useGetSavedListsQuery(USER_Id);
  const [updateSavedLists] = useUpdateSavedListsMutation();

  const isSaved = savedLists?.some((savedId) => savedId === listId);

  const toggleSavedList = () => {
    const newSavedLists = isSaved
      ? savedLists.filter((id) => id !== listId)
      : [...savedLists, listId];
    updateSavedLists({ userId: USER_Id, savedLists: newSavedLists });
  };

  return { isSaved, toggleSavedList };
};
