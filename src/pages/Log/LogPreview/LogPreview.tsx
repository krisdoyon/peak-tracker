import styles from "components/PreviewList/PreviewListItem/PreviewListItem.module.scss";
import { PreviewListItem } from "components/PreviewList";
import { IconButton, ViewButton } from "components/Buttons";
import { ILogEntry } from "models/interfaces";
import { getDisplayDate } from "utils/getDisplayDate";
import { useNavigate } from "react-router-dom";
import { getPeakNames } from "utils/peakUtils";
import { useGetListsQuery, useRemoveLogEntryMutation } from "features/apiSlice";

const USER_ID = "abc123";

export const LogPreview = ({ peakIds, logID, date }: ILogEntry) => {
  const { data: allPeakLists } = useGetListsQuery();
  const peakNamesArr = getPeakNames(peakIds, allPeakLists);
  const peakString =
    peakNamesArr.length > 1
      ? peakNamesArr.slice(0, -1).join(", ") + " and " + peakNamesArr.slice(-1)
      : peakNamesArr[0];
  const displayDate = getDisplayDate(date);
  const navigate = useNavigate();
  const [removeLogEntry] = useRemoveLogEntryMutation();

  const handleRemove = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      removeLogEntry({ userId: USER_ID, logId: logID });
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
