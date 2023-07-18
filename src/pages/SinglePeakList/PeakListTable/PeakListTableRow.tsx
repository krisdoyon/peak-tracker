import { usePeak } from "hooks/usePeak";
import styles from "./PeakListTable.module.scss";
import { LogTripButton } from "components/Buttons/";
import { closePopup, openPopup } from "features/mapSlice";
import { useAppDispatch } from "hooks/reduxHooks";

interface Props {
  peakId: number;
  listId: string;
  num: number;
}

export const PeakListTableRow = ({ peakId, listId, num }: Props) => {
  const { peak, isCompleted, completedDate } = usePeak(peakId);
  const dispatch = useAppDispatch();

  if (peak) {
    return (
      <tr
        onMouseEnter={() => dispatch(openPopup(peakId))}
        onMouseLeave={() => dispatch(closePopup())}
        className={`${styles.row} ${isCompleted ? styles.complete : ""}`}
      >
        <td>
          <strong>{num + 1}</strong>
        </td>
        <td style={{ textAlign: "left" }}>{peak.name}</td>
        <td>{peak.state}</td>

        <td>{peak.elevation.toLocaleString()}</td>
        <td>
          {!isCompleted && <LogTripButton listId={listId} peakId={peak.id} />}
          {isCompleted && completedDate}
        </td>
      </tr>
    );
  }
  return <></>;
};
