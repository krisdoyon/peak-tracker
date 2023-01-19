import styles from "components/PreviewList/PreviewListItem/PreviewListItem.module.scss";
import { PreviewListItem } from "components/PreviewList";
import { IconButton, ViewButton } from "components/Buttons";
import { ILogEntry } from "models/interfaces";
import { useLogContext, LogActionKind } from "context/logContext";
import { usePeakListContext } from "context/peakListContext";
import { getDisplayDate } from "utils/getDisplayDate";
import { useNavigate } from "react-router-dom";

export const LogPreview = ({ peakIds, logID, date }: ILogEntry) => {
  const { getPeakNames } = usePeakListContext();
  const peakNamesArr = getPeakNames(peakIds);
  const peakString =
    peakNamesArr.length > 1
      ? peakNamesArr.slice(0, -1).join(", ") + " and " + peakNamesArr.slice(-1)
      : peakNamesArr[0];
  const { dispatch } = useLogContext();
  const displayDate = getDisplayDate(date);
  const navigate = useNavigate();

  const handleRemove = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      dispatch({ type: LogActionKind.REMOVE_ENTRY, payload: logID });
    }
  };

  return (
    <PreviewListItem>
      <IconButton icon="trash" onClick={handleRemove}></IconButton>
      <div className={styles.info}>
        <h3 className={styles.heading}>
          <strong>{displayDate}</strong> - {peakIds.length}{" "}
          {peakIds.length > 1 ? "Peaks" : "Peak"}
        </h3>
        <span>{peakString}</span>
      </div>
      <ViewButton onClick={() => navigate(`/log/${logID.toString()}`)} />
    </PreviewListItem>
  );
};
