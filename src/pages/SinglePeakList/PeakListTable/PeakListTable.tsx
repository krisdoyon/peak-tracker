import styles from "./PeakListTable.module.scss";
import { IPeak } from "models/interfaces";
import { TextButton } from "components/Buttons";
import {
  NewEntryActionKind,
  useNewEntryContext,
} from "context/newEntryContext";
import { useNavigate } from "react-router-dom";
import { usePeakListContext } from "context/peakListContext";
import { useLogContext } from "context/logContext";

interface Props {
  peaks: IPeak[];
  listID: string;
}

export const PeakListTable = ({ listID, peaks }: Props) => {
  const { dispatch } = useNewEntryContext();
  const { isPeakCompleted } = usePeakListContext();
  const { getCompletedDate } = useLogContext();
  const navigate = useNavigate();
  const handleLogTrip = (peakID: number) => {
    dispatch({
      type: NewEntryActionKind.TOGGLE_CHECKED_PEAK,
      payload: { checked: true, peakID },
    });
    dispatch({
      type: NewEntryActionKind.SET_LIST_ID,
      payload: listID,
    });
    navigate("/new-entry");
  };

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
                  <TextButton
                    color="green"
                    className={styles["btn-log-trip"]}
                    onClick={() => handleLogTrip(peak.id)}
                  >
                    LOG TRIP
                  </TextButton>
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
