import styles from "components/PreviewList/PreviewListItem/PreviewListItem.module.scss";
import { PreviewListItem } from "components/PreviewList";
import { IconButton, ViewButton } from "components/Buttons";
import { ILogEntry } from "models/interfaces";
import { getDisplayDate } from "utils/getDisplayDate";
import { getPeakNames } from "utils/peakUtils";
import {
  useGetListsQuery,
  useGetPeaksQuery,
  useRemoveLogEntryMutation,
} from "features/apiSlice";
import { useAppSelector } from "hooks/reduxHooks";
import { useAppNavigate } from "hooks/useAppNaviage";
import { TripType } from "pages/NewEntry/NewEntryType/NewEntryType";

export const LogPreview = ({ peakIds, logId, date, tripType }: ILogEntry) => {
  const { userId, token } = useAppSelector((state) => state.auth);
  const { data: allPeaks } = useGetPeaksQuery();
  const peakNamesArr = getPeakNames(peakIds, allPeaks);
  const peakString =
    peakNamesArr.length > 1
      ? peakNamesArr.slice(0, -1).join(", ") + " and " + peakNamesArr.slice(-1)
      : peakNamesArr[0];
  const navigate = useAppNavigate();
  const [removeLogEntry] = useRemoveLogEntryMutation();

  const handleRemove = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      removeLogEntry({ userId, logId, token });
    }
  };

  const handleViewClick = () => {
    let path;
    if (tripType === TripType.COMPLETED || tripType === undefined) {
      path = "log";
    } else if (tripType === TripType.PLANNED) {
      path = "planner";
    }
    navigate(`/${path}/${logId.toString()}`);
  };

  return (
    <PreviewListItem>
      <IconButton icon="trash" onClick={handleRemove}></IconButton>
      <div className={styles.info}>
        <h3 className={styles.heading}>
          {tripType === TripType.COMPLETED && (
            <>
              <strong>{getDisplayDate(date)}</strong>
              {" - "}
              {peakIds?.length || 0} {peakIds?.length === 1 ? "Peak" : "Peaks"}
            </>
          )}
          {tripType === TripType.PLANNED && (
            <strong>
              {peakIds?.length || 0} {peakIds?.length === 1 ? "Peak" : "Peaks"}
            </strong>
          )}
        </h3>
        <span>{peakString}</span>
      </div>
      <ViewButton onClick={handleViewClick} />
    </PreviewListItem>
  );
};
