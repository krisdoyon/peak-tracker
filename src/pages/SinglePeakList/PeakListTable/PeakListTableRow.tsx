import { usePeak } from "hooks/usePeak";
import styles from "./PeakListTable.module.scss";
import { LogTripButton } from "components/Buttons/";
import { MapActionType, useMapContext } from "context/mapContext";

interface Props {
  peakID: number;
  listID: string;
  num: number;
}

export const PeakListTableRow = ({ peakID, listID, num }: Props) => {
  const { peak, isCompleted, completedDate } = usePeak(peakID);
  const { dispatch } = useMapContext();

  if (peak) {
    return (
      <tr
        onMouseOver={() =>
          dispatch({ type: MapActionType.OPEN_POPUP, payload: peak.id })
        }
        onMouseOut={() => dispatch({ type: MapActionType.CLOSE_POPUP })}
        className={`${styles.row} ${isCompleted ? styles.complete : ""}`}
      >
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
