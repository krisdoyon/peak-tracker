import { useEffect, useState } from "react";
import { ILogEntry, IPeakList } from "models/interfaces";

export const usePagination = <T extends IPeakList | ILogEntry>(
  arr: T[] = [],
  itemsPerPage: number
) => {
  const [page, setPage] = useState(1);
  const maxPage = Math.ceil(arr.length / itemsPerPage);

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    if (page > 1 && page > maxPage) {
      setPage((curPage) => curPage - 1);
    }
  }, [page, maxPage]);

  const start = (page - 1) * itemsPerPage;
  const end = page * itemsPerPage;
  const displayArr = arr.slice(start, end);

  return { nextPage, prevPage, displayArr, maxPage, page, setPage };
};
