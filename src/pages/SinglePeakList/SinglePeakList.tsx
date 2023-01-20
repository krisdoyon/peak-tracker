import styles from "./SinglePeakList.module.scss";
import headingStyles from "components/Card/CardHeadingGrid/CardHeadingGrid.module.scss";
import { Card, CardHeadingGrid, CardBody } from "components/Card";
import { ProgressBar } from "components/ProgressBar/ProgressBar";
import {
  PeakListActionType,
  usePeakListContext,
} from "context/peakListContext";

import { useParams } from "react-router-dom";
import { IconButton } from "components/Buttons";
import { PeakListTable } from "pages/SinglePeakList/PeakListTable/PeakListTable";
import { IPeak, IPeakList } from "models/interfaces";
import { useEffect, useState } from "react";
import { sortPeaks, SortType } from "utils/sortPeaks";
import { useMapContext } from "context/mapContext";

export const SinglePeakList = () => {
  const [sort, setSort] = useState<SortType>(SortType.ELEVATION);
  const [displayPeaks, setDisplayPeaks] = useState<IPeak[]>([]);
  const { listID } = useParams();
  const {
    state: { savedListIds, listCounts },
    dispatch,
    getPeakListById,
  } = usePeakListContext();
  const { dispatch: mapDispatch, plotPeakList } = useMapContext();
  const [list, setList] = useState<IPeakList | undefined>();

  const isSaved = savedListIds.some((savedID) => savedID === listID);

  useEffect(() => {
    if (list) {
      setDisplayPeaks(() => [...sortPeaks(list.peaks, sort)]);
    }
  }, [sort]);

  useEffect(() => {
    if (listID) {
      setList(getPeakListById(listID));
    }
  }, []);

  useEffect(() => {
    if (list && listID) {
      setDisplayPeaks(sortPeaks(list.peaks, sort));
      plotPeakList(listID);
    }
  }, [list]);

  if (list && listID) {
    return (
      <Card>
        <CardHeadingGrid title={list.title} backTo={"peak-lists"}>
          <div className={headingStyles.row}>
            <span>{`${listCounts[listID]} of ${list.peaks.length} peaks`}</span>
            <span>|</span>
            <div className={headingStyles["btn-wrapper"]}>
              <IconButton
                icon={isSaved ? "remove" : "add"}
                onClick={() =>
                  dispatch({
                    type: PeakListActionType.TOGGLE_SAVED_LIST,
                    payload: listID,
                  })
                }
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
              peakCount={list.peaks.length}
              numCompleted={listCounts[listID]}
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
