import styles from "./StatsGrid.module.scss";
import { useStatsContext } from "context/statsContext";

export const StatsGrid = () => {
  const {
    numberEntries,
    numberPeaks,
    totalDistance,
    totalElevation,
    totalTime,
  } = useStatsContext();

  return (
    <div className={styles.grid}>
      <span className={styles.label}>Number of Log Entries:</span>
      <span>
        {`${numberEntries} ${numberEntries === 1 ? "entry" : "entries"}`}
      </span>
      <span className={styles.label}>Total Completed Peaks:</span>
      <span>{`${numberPeaks} ${numberPeaks === 1 ? "peak" : "peaks"}`}</span>
      <span className={styles.label}>Total Distance:</span>
      <span>{totalDistance ? `${totalDistance} mi` : "n/a"}</span>
      <span className={styles.label}>Total Elevation Gain:</span>
      <span>
        {totalElevation ? `${totalElevation.toLocaleString()} ft` : "n/a"}
      </span>
      <span className={styles.label}>Total Time:</span>
      <span>{totalTime ? `${totalTime} hrs` : "n/a"} </span>
    </div>
  );
};
