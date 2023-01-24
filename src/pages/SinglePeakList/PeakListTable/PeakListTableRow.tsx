import { usePeak } from "hooks/usePeak";
import styles from "./PeakListTable.module.scss";
import { LogTripButton } from "components/Buttons/";

interface Props {
  peakID: number;
  listID: string;
  num: number;
}

export const PeakListTableRow = ({ peakID, listID, num }: Props) => {
  const { peak, isCompleted, completedDate } = usePeak(peakID);

  if (peak) {
    return (
      <tr className={`${styles.row} ${isCompleted ? styles.complete : ""}`}>
        <td>
          <strong>{num + 1}</strong>
        </td>
        <td style={{ textAlign: "left" }}>{peak.name}</td>
        <td>{peak.state}</td>

        <td>{peak.elevation.toLocaleString()}</td>
        <td>
          {!isCompleted && <LogTripButton listID={listID} peakID={peak.id} />}
          {isCompleted && completedDate}
        </td>
      </tr>
    );
  }
  return <></>;
};
