import styles from "components/PreviewList/PreviewListItem/PreviewListItem.module.scss";
import { PreviewListItem } from "components/PreviewList";
import { IconButton, ViewButton } from "components/Buttons";
import { ILogEntry } from "models/interfaces";
import { IPeak } from "models/interfaces";
import { useLogContext, LogActionKind } from "context/logContext";

export const LogPreview = ({ peaks, displayDate, logID }: ILogEntry) => {
  const peakNamesArr = peaks.map((peak: IPeak) => peak.name);
  const peakString =
    peakNamesArr.length > 1
      ? peakNamesArr.slice(0, -1).join(", ") + " and " + peakNamesArr.slice(-1)
      : peakNamesArr[0];
  const { logDispatch } = useLogContext();

  const handleRemove = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      logDispatch({ type: LogActionKind.REMOVE_ENTRY, payload: logID });
    }
  };

  return (
    <PreviewListItem>
      <IconButton icon="trash" onClick={handleRemove}></IconButton>
      <div className={styles.info}>
        <h3 className={styles.heading}>
          <strong>{displayDate}</strong> - {peaks.length}{" "}
          {peaks.length > 1 ? "Peaks" : "Peak"}
        </h3>
        <span>{peakString}</span>
      </div>
      <ViewButton to={logID.toString()} />
    </PreviewListItem>
  );
};
