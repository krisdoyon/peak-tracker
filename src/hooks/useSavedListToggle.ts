import {
  useGetSavedListsQuery,
  useUpdateSavedListsMutation,
} from "features/apiSlice";

import { useAppSelector } from "hooks/reduxHooks";

export const useSavedListToggle = (listId: string) => {
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);

  const { data: savedLists = [] } = useGetSavedListsQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn || token === null }
  );
  const [updateSavedLists] = useUpdateSavedListsMutation();

  const isSaved = savedLists?.some((savedId) => savedId === listId);

  const toggleSavedList = () => {
    const newSavedLists = isSaved
      ? savedLists.filter((id) => id !== listId)
      : [...savedLists, listId];
    updateSavedLists({ userId, savedLists: newSavedLists, token });
  };

  return { isSaved, toggleSavedList };
};
