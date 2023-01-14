import styles from "./PeakListTable.module.scss";
import { IPeak } from "models/interfaces";
import { TextButton } from "components/Buttons";
import { useNewEntryContext } from "context/newEntryContext";
import { useNavigate } from "react-router-dom";

interface Props {
  peaks: IPeak[];
  listID: string;
}

export const PeakListTable = ({ listID, peaks }: Props) => {
  const { setCheckedPeaks, setListID } = useNewEntryContext();
  const navigate = useNavigate();
  const handleLogTrip = (peakID: number) => {
    setCheckedPeaks([peakID]);
    setListID(listID);
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
          return (
            <tr key={peak.id} className={styles.row}>
              <td>
                <strong>{i + 1}</strong>
              </td>
              <td style={{ textAlign: "left" }}>{peak.name}</td>
              <td>{peak.state}</td>

              <td>{peak.elevation.toLocaleString()}</td>
              <td>
                <TextButton
                  color="green"
                  className={styles["btn-log-trip"]}
                  onClick={() => handleLogTrip(peak.id)}
                >
                  LOG TRIP
                </TextButton>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
