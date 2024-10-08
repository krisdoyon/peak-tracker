import styles from "./PeakLists.module.scss";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeading } from "components/Card";
import { TextButton, PaginationButton } from "components/Buttons";
import { PreviewList, PreviewControls } from "components/PreviewList";
import { PeakListPreview } from "./PeakListPreview/PeakListPreview";
import { usePagination } from "hooks/usePagination";
import { NoData } from "components/NoData/NoData";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import {
  useGetListsQuery,
  useGetLogEntriesQuery,
  useGetSavedListsQuery,
} from "features/apiSlice";
import { useListCounts } from "hooks/useListCounts";

import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import { ModalType, openModal, setError } from "features/modalSlice";

const noDataMessage = (
  <p>
    You haven't saved any peak lists yet. <br />
    Click "all lists" above to get started!
  </p>
);

export const PeakLists = () => {
  const { userId, isLoggedIn, token } = useAppSelector((state) => state.auth);

  const [previewType, setPreviewType] = useState<"all" | "saved">("all");

  const dispatch = useAppDispatch();

  const {
    data: allPeakLists = [],
    isLoading: isListsLoading,
    isError: isListsError,
    error,
  } = useGetListsQuery();

  // const {
  //   data: allLogEntries = [],
  //   isLoading: isLogLoading,
  //   isError: isLogError,
  //   error: logError,
  // } = useGetLogEntriesQuery(
  //   { userId, token },
  //   { skip: userId === null || !isLoggedIn }
  // );

  const {
    data: savedLists = [],
    isLoading: isSavedListsLoading,
    isError: isSavedListsError,
    // error,
  } = useGetSavedListsQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn }
  );

  const isLoading = isListsLoading || isSavedListsLoading;
  const isError = isListsError || isSavedListsError;
  // const isError = false;

  const displayLists =
    previewType === "all"
      ? allPeakLists
      : allPeakLists.filter((list) => savedLists.includes(list.listId));

  const listCounts = useListCounts();

  const { page, maxPage, displayArr, nextPage, prevPage, setPage } =
    usePagination(displayLists, 6);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [previewType]);

  if (isLoading) {
    return (
      <Card>
        <LoadingSpinner />
      </Card>
    );
  }

  // if (error) {
  //   if ("status" in error) {
  //     const errMsg =
  //       "error" in error ? error.error : JSON.stringify(error.data);
  //   }
  //   return (
  //     <Card>
  //       <p>errMsg</p>
  //     </Card>
  //   );
  // }

  if (isError) {
    // return (
    //   <Card>
    //     <p>ERROR</p>
    //   </Card>
    // );
    dispatch(setError(error));
    dispatch(openModal(ModalType.ERROR));
  }

  return (
    <Card>
      <CardHeading title="Peak Lists" />
      <PreviewControls variant="peak-lists">
        {page !== 1 && (
          <PaginationButton variant="prev" onClick={prevPage}>
            {`Page ${page - 1}`}
          </PaginationButton>
        )}
        <TextButton
          className={styles["btn-all"]}
          color="light"
          active={previewType === "all"}
          onClick={() => setPreviewType("all")}
        >
          all lists
        </TextButton>
        <TextButton
          className={styles["btn-saved"]}
          color="light"
          active={previewType === "saved"}
          onClick={() => setPreviewType("saved")}
        >
          saved lists
        </TextButton>
        {page < maxPage && (
          <PaginationButton variant="next" onClick={nextPage}>
            {`Page ${page + 1}`}
          </PaginationButton>
        )}
      </PreviewControls>
      <CardBody>
        {displayArr.length > 0 && (
          <PreviewList>
            {displayArr.map((peakList) => {
              const { title, listId } = peakList;
              const numCompleted = listCounts[listId] || 0;
              return (
                <PeakListPreview
                  key={listId}
                  title={title}
                  peakCount={peakList.peaks.length}
                  listId={listId}
                  numCompleted={numCompleted}
                />
              );
            })}
          </PreviewList>
        )}
        {previewType === "saved" && displayLists?.length === 0 && (
          <NoData message={noDataMessage} />
        )}
      </CardBody>
    </Card>
  );
};
