import { useGetListsQuery, useGetLogEntriesQuery } from "features/apiSlice";
import { useListCounts } from "./useListCounts";

const USER_Id = "abc123";

export const useFilterSelectOptions = () => {
  const { data: allLogEntries = [] } = useGetLogEntriesQuery(USER_Id);
  const { data: allPeakLists = [] } = useGetListsQuery();
  const listCounts = useListCounts();
  const lists: { listId: string; title: string }[] = [];
  const years: string[] = [];
  const months: { alpha: string; numeric: string }[] = [];
  for (const listId in listCounts) {
    if (listCounts[listId] !== 0) {
      const peakList = allPeakLists.find((list) => list.listId === listId);
      const title = peakList?.title;
      title != undefined && lists.push({ listId, title });
    }
  }
  for (const entry of allLogEntries) {
    const date = new Date(`${entry.date}T00:00:00`);
    const alpha = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );
    const numeric = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
    }).format(date);
    const entryYear = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
    }).format(date);
    if (!months.some((monthObj) => monthObj.alpha === alpha)) {
      months.push({ alpha, numeric });
    }
    if (!years.some((year) => year === entryYear)) {
      years.push(entryYear);
    }
  }
  months.sort((a, b) => +a.numeric - +b.numeric);
  years.sort((a, b) => +b - +a);
  lists.sort((a, b) => a.title.localeCompare(b.title));
  return { lists, months, years };
};
