import styles from "./SinglePeakList.module.scss";
import headingStyles from "components/Card/CardHeadingGrid/CardHeadingGrid.module.scss";
import { Card, CardHeadingGrid, CardBody } from "components/Card";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { useParams } from "react-router-dom";
import { IconButton } from "components/Buttons";
import { PeakListTable } from "./PeakListTable/PeakListTable";
import { useEffect, useState } from "react";
import { sortPeaks, SortType } from "utils/sortPeaks";
import { useListCounts } from "hooks/useListCounts";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import { useGetSavedListsQuery } from "features/apiSlice";
import { useSavedListToggle } from "hooks/useSavedListToggle";
import { usePeakList } from "hooks/usePeakList";
import { plotList } from "features/mapSlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";

export const SinglePeakList = () => {
  const [sort, setSort] = useState<SortType>(SortType.ELEVATION);
  const { userId, token, isLoggedIn } = useAppSelector((state) => state.auth);
  const { listId } = useParams() as { listId: string };
  const dispatch = useAppDispatch();

  const {
    data: savedLists = [],
    isLoading: isListsLoading,
    error: listsError,
  } = useGetSavedListsQuery(
    { userId, token },
    { skip: userId === null || !isLoggedIn || token === null }
  );

  const {
    data: peakList,
    isLoading: isPeaksLoading,
    error: peaksError,
  } = usePeakList(listId);

  const { isSaved, toggleSavedList } = useSavedListToggle(listId);

  const listCounts = useListCounts();

  const displayPeaks = sortPeaks(peakList?.peaks, sort);
  const numCompleted = listCounts[listId] || 0;

  useEffect(() => {
    if (peakList) {
      dispatch(plotList({ peaks: peakList.peaks, listId }));
    }
  }, [peakList]);

  if (isPeaksLoading || isListsLoading) {
    return (
      <Card>
        <LoadingSpinner />
      </Card>
    );
  }

  if (peaksError || listsError) {
    return (
      <Card>
        <p>Error, couldn't find list</p>
      </Card>
    );
  }

  if (peakList && savedLists) {
    return (
      <Card>
        <CardHeadingGrid title={peakList.title} backTo={"peak-lists"}>
          <div className={headingStyles.row}>
            <span>{`${numCompleted} of ${peakList.peaks.length} peaks`}</span>
            <span>|</span>
            <div className={headingStyles["btn-wrapper"]}>
              <IconButton
                icon={isSaved ? "remove" : "add"}
                onClick={toggleSavedList}
                disabled={!isLoggedIn}
              />
              <span>{`${isSaved ? "Remove from" : "Add to"} my lists`}</span>
            </div>
            <span>|</span>
            <label id="sort-table-select-label" htmlFor="sort-table-select">
              Sort by:
            </label>
            <select
              id="sort-table-select"
              defaultValue="elevation"
              onChange={(e) => {
                setSort(e.target.value as SortType);
              }}
            >
              {Object.values(SortType).map((option, i) => {
                return (
                  <option key={i} value={option}>
                    {option}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={headingStyles["progress-wrapper"]}>
            <ProgressBar
              peakCount={peakList.peaks.length}
              numCompleted={numCompleted}
            />
          </div>
        </CardHeadingGrid>
        <CardBody>
          <p className={styles.description}>{peakList.description}</p>
          <PeakListTable peaks={displayPeaks} listId={listId} />
        </CardBody>
      </Card>
    );
  }
  return <></>;
};
