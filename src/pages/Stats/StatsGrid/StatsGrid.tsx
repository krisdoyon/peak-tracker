import styles from "./StatsGrid.module.scss";

interface Props {
  numEntries: number;
  numPeaks: number;
  distance: number;
  elevation: number;
  time: number;
}

export const StatsGrid = ({
  numEntries,
  numPeaks,
  distance,
  elevation,
  time,
}: Props) => {
  return (
    <div className={styles.grid}>
      <span className={styles.label}>Number of Log Entries:</span>
      <span>{`${numEntries.toLocaleString()} ${
        numEntries === 1 ? "entry" : "entries"
      }`}</span>
      <span className={styles.label}>Total Completed Peaks:</span>
      <span>{`${numPeaks.toLocaleString()} ${
        numPeaks === 1 ? "peak" : "peaks"
      }`}</span>
      <span className={styles.label}>Total Distance:</span>
      <span>{distance ? `${distance.toLocaleString()} mi` : "n/a"}</span>
      <span className={styles.label}>Total Elevation Gain:</span>
      <span>{elevation ? `${elevation.toLocaleString()} ft` : "n/a"}</span>
      <span className={styles.label}>Total Time:</span>
      <span>{time ? `${time.toLocaleString()} hrs` : "n/a"} </span>
    </div>
  );
};
