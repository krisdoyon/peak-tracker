import styles from "./PeakListTable.module.scss";
import { IPeak } from "models/interfaces";
import { usePeakListContext } from "context/peakListContext";
import { useLogContext } from "context/logContext";
import { LogTripButton } from "components/Buttons/";

interface Props {
  peaks: IPeak[];
  listID: string;
}

export const PeakListTable = ({ listID, peaks }: Props) => {
  const { isPeakCompleted } = usePeakListContext();
  const { getCompletedDate } = useLogContext();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.number}>#</th>
          <th className={styles.name}>Name</th>
          <th className={styles.state}>State</th>
          <th className={styles.elevation}>Elevation (ft)</th>
          <th className={styles.date}>Hiked On</th>
        </tr>
      </thead>
      <tbody>
        {peaks.map((peak, i) => {
          const isCompleted = isPeakCompleted(peak.id);
          let completedDate;
          if (isCompleted) {
            completedDate = getCompletedDate(peak.id);
          }
          return (
            <tr
              key={peak.id}
              className={`${styles.row} ${isCompleted ? styles.complete : ""}`}
            >
              <td>
                <strong>{i + 1}</strong>
              </td>
              <td style={{ textAlign: "left" }}>{peak.name}</td>
              <td>{peak.state}</td>

              <td>{peak.elevation.toLocaleString()}</td>
              <td>
                {!isCompleted && (
                  <LogTripButton listID={listID} peakID={peak.id} />
                )}
                {isCompleted && completedDate}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
