import styles from "./LogEntryGrid.module.scss";
import { ILogEntry } from "models/interfaces";
import { ViewButton } from "components/Buttons";
import { Fragment } from "react";
import { getLogStats, getPeakById, getPeaksById } from "utils/peakUtils";
import { useGetListsQuery } from "features/apiSlice";
import { getLogLists } from "utils/peakUtils";
import { usePeakList } from "hooks/usePeakList";
import sprite from "assets/img/sprite.svg";
import { useAppDispatch } from "hooks/reduxHooks";
import { plotList, plotLogEntry } from "features/mapSlice";

interface Props {
  listId: string;
}

const ListMatchRow = ({ listId }: Props) => {
  const { data: list } = usePeakList(listId);
  const dispatch = useAppDispatch();

  if (list) {
    return (
      <Fragment key={listId}>
        <span>{list.title}</span>
        <ViewButton
          small={true}
          onClick={() => dispatch(plotList({ listId, peaks: list.peaks }))}
        />
      </Fragment>
    );
  }
  return <></>;
};

export const LogEntryGrid = ({ peakIds, stats, notes, rating }: ILogEntry) => {
  const { data: allPeakLists = [] } = useGetListsQuery();
  const dispatch = useAppDispatch();

  const listMatchIds = getLogLists(peakIds, allPeakLists);
  const logPeaks = getPeaksById(peakIds, allPeakLists);
  const { time, avgElevation, avgSpeed } = getLogStats(stats);
  const { distance, elevation } = stats;

  return (
    <div className={styles.grid}>
      <span className={styles.label}>Peak Lists:</span>
      <div className={styles.lists}>
        {listMatchIds.map((listId) => {
          return <ListMatchRow key={listId} listId={listId} />;
        })}
      </div>
      <span className={styles.label}>Peaks:</span>
      <div
        className={styles.peaks}
        style={{
          gridTemplateRows: `repeat(${peakIds.length}, max-content`,
        }}
      >
        {peakIds.map((peakId) => {
          const peak = getPeakById(peakId, allPeakLists);
          if (peak) {
            return (
              <span key={peakId} className={styles.peak}>{`${
                peak.name
              } - ${peak.elevation.toLocaleString()} ft`}</span>
            );
          }
        })}
        <ViewButton
          small={true}
          onClick={() => dispatch(plotLogEntry(logPeaks))}
        />
      </div>
      <span className={styles.label}>Distance:</span>
      <span>{distance ? distance + ` mi` : "n/a"}</span>
      <span className={styles.label}>Elevation:</span>
      <span>{elevation ? elevation.toLocaleString() + ` ft` : "n/a"}</span>
      <span className={styles.label}>Time:</span>
      <span>{time ? time + ` hrs` : "n/a"}</span>
      <span className={styles.label}>Avg Speed:</span>
      <span>{avgSpeed ? avgSpeed + ` mi/hr` : "n/a"}</span>
      <span className={styles.label}>Avg Elevation:</span>
      <span>
        {avgElevation ? avgElevation.toLocaleString() + ` ft/mi` : "n/a"}
      </span>
      <span className={styles.label}>Rating:</span>
      <span>
        {rating > 0
          ? Array.from({ length: 5 }, (_, i) => {
              const isFilled = rating >= i + 1;
              return (
                <svg
                  key={i}
                  className={`${styles["star-icon"]} ${
                    isFilled ? styles.full : ""
                  }`}
                >
                  <use
                    href={`${sprite}${
                      isFilled ? "#icon-star-solid" : "#icon-star"
                    }`}
                  ></use>
                </svg>
              );
            })
          : "n/a"}
      </span>
      <span className={styles.label}>Notes:</span>
      <span>{notes ? notes : "n/a"}</span>
    </div>
  );
};
