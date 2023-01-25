import {
  useGetSavedListsQuery,
  useUpdateSavedListsMutation,
} from "features/apiSlice";

const USER_ID = "abc123";

export const useSavedListToggle = (listID: string) => {
  const { data: savedLists = [] } = useGetSavedListsQuery(USER_ID);
  const [updateSavedLists] = useUpdateSavedListsMutation();

  const isSaved = savedLists?.some((savedID) => savedID === listID);

  const toggleSavedList = () => {
    const newSavedLists = isSaved
      ? savedLists.filter((id) => id !== listID)
      : [...savedLists, listID];
    updateSavedLists({ userId: USER_ID, savedLists: newSavedLists });
  };

  return { isSaved, toggleSavedList };
};
