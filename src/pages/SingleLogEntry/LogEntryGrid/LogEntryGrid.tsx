import styles from "./LogEntryGrid.module.scss";
import { ILogEntry } from "models/interfaces";
import { ViewButton } from "components/Buttons";

export const LogEntryGrid = ({ peaks, lists, stats, notes }: ILogEntry) => {
  return (
    <div className={styles.grid}>
      <span className={styles.label}>Peak Lists:</span>
      <div className={styles.lists}>
        {lists.map((list) => {
          return (
            <>
              <span>{list.title}</span>
              <ViewButton small={true} to={""} />
            </>
          );
        })}
      </div>
      <span className={styles.label}>Peaks:</span>
      <div
        className={styles.peaks}
        style={{
          gridTemplateRows: `repeat(${peaks.length}, max-content`,
        }}
      >
        {peaks.map((peak) => {
          return (
            <span className={styles.peak}>{`${
              peak.name
            } - ${peak.elevation.toLocaleString()} ft`}</span>
          );
        })}
        <ViewButton small={true} to={""} />
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
      <span>RATING MARKUP</span>
      <span className={styles.label}>Notes:</span>
      <span>{notes ? notes : "n/a"}</span>
    </div>
  );
};
