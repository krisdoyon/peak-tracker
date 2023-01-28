import styles from "./LogEntryGrid.module.scss";
import { ILogEntry } from "models/interfaces";
import { ViewButton } from "components/Buttons";
import { Fragment } from "react";
import { getPeakById, getPeaksById } from "utils/peakUtils";
import { useGetListsQuery } from "features/apiSlice";
import { peakListsArr } from "assets/data/createPeakLists";
import { getLogLists } from "utils/peakUtils";
import { MapActionType, useMapContext } from "context/mapContext";
import { usePeakList } from "hooks/usePeakList";
import sprite from "assets/img/sprite.svg";

interface Props {
  listID: string;
}

const ListMatchRow = ({ listID }: Props) => {
  const { data: list, isLoading } = usePeakList(listID);
  const { dispatch: mapDispatch } = useMapContext();

  return (
    <Fragment key={listID}>
      <span>{list?.title}</span>
      <ViewButton
        small={true}
        onClick={() => {
          mapDispatch({
            type: MapActionType.SET_LIST_ID,
            payload: listID,
          });
          mapDispatch({
            type: MapActionType.SET_PEAKS,
            payload: list?.peaks,
          });
        }}
      />
    </Fragment>
  );
};

export const LogEntryGrid = ({ peakIds, stats, notes, rating }: ILogEntry) => {
  const { data: allPeakLists = [] } = useGetListsQuery();
  const { dispatch: mapDispatch } = useMapContext();
  
  const listMatchIds = getLogLists(peakIds, allPeakLists);
  const logPeaks = getPeaksById(peakIds, allPeakLists);

  return (
    <div className={styles.grid}>
      <span className={styles.label}>Peak Lists:</span>
      <div className={styles.lists}>
        {listMatchIds.map((listID) => {
          return <ListMatchRow key={listID} listID={listID} />;
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
          const peak = getPeakById(peakId, peakListsArr);
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
          onClick={() =>
            mapDispatch({ type: MapActionType.SET_PEAKS, payload: logPeaks })
          }
        />
      </div>
      <span className={styles.label}>Distance:</span>
      <span>{stats.distance ? stats.distance + ` mi` : "n/a"}</span>
      <span className={styles.label}>Elevation:</span>
      <span>
        {stats.elevation ? stats.elevation.toLocaleString() + ` ft` : "n/a"}
      </span>
      <span className={styles.label}>Time:</span>
      <span>{stats.time ? stats.time + ` hrs` : "n/a"}</span>
      <span className={styles.label}>Avg Speed:</span>
      <span>{stats.avgSpeed ? stats.avgSpeed + ` mi/hr` : "n/a"}</span>
      <span className={styles.label}>Avg Elevation:</span>
      <span>
        {stats.avgElevation
          ? stats.avgElevation.toLocaleString() + ` ft/mi`
          : "n/a"}
      </span>
      <span className={styles.label}>Rating:</span>
      <span>
        {Array.from({ length: 5 }, (_, i) => {
          const isFilled = rating >= i + 1;
          return (
            <svg
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
        })}
      </span>
      <span className={styles.label}>Notes:</span>
      <span>{notes ? notes : "n/a"}</span>
    </div>
  );
};
