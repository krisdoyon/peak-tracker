import styles from "./SinglePeakList.module.scss";
import headingStyles from "components/Card/CardHeadingGrid/CardHeadingGrid.module.scss";
import { Card, CardHeadingGrid, CardBody } from "components/Card";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import { usePeakListContext } from "context/peakListContext";

import { useParams } from "react-router-dom";
import { IconButton } from "components/Buttons";
import { PeakListTable } from "pages/SinglePeakList/PeakListTable/PeakListTable";
import { IPeak, IPeakList } from "models/interfaces";
import { useEffect, useState } from "react";
import { sortPeaks, SortType } from "utils/sortPeaks";

export const SinglePeakList = () => {
  const { listID } = useParams();
  const { getPeakListById, savedListIds, toggleSavedList } =
    usePeakListContext();
  const [sort, setSort] = useState<SortType>(SortType.ELEVATION);
  let list: IPeakList | undefined;
  let displayPeaks: IPeak[] = [];
  if (listID) {
    list = getPeakListById(listID);
  }
  if (list) {
    displayPeaks = sortPeaks(list.peaks, sort);
  }
  const numCompleted = 3;
  const isSaved = savedListIds.some((savedID) => savedID === listID);

  useEffect(() => {
    if (list) {
      displayPeaks = sortPeaks(list.peaks, sort);
    }
  }, [sort]);

  if (list && listID) {
    return (
      <Card>
        <CardHeadingGrid title={list.title} backTo={"peak-lists"}>
          <div className={headingStyles.row}>
            <span>{`${numCompleted} of ${list.peakCount} peaks`}</span>
            <span>|</span>
            <div className={headingStyles["btn-wrapper"]}>
              <IconButton
                icon={isSaved ? "remove" : "add"}
                onClick={() => toggleSavedList(listID)}
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
              peakCount={list.peakCount}
              numCompleted={numCompleted}
            />
          </div>
        </CardHeadingGrid>
        <CardBody>
          <p className={styles.description}>{list.description}</p>
          <PeakListTable peaks={displayPeaks} listID={listID} />
        </CardBody>
      </Card>
    );
  } else {
    return <></>;
  }
};
