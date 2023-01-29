import headingStyles from "components/Card/CardHeadingGrid/CardHeadingGrid.module.scss";
import { Card, CardBody, CardHeadingGrid } from "components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { IconButton } from "components/Buttons";
import { LogEntryGrid } from "./LogEntryGrid/LogEntryGrid";
import { getDisplayDate } from "utils/getDisplayDate";
import { useEffect } from "react";
import { LoadingSpinner } from "components/LoadingSpinner/LoadingSpinner";
import { useGetListsQuery, useRemoveLogEntryMutation } from "features/apiSlice";
import { useLogEntry } from "hooks/useLogEntry";
import { getPeaksById } from "utils/peakUtils";
import { plotLogEntry } from "features/mapSlice";
import { useAppDispatch } from "hooks/reduxHooks";

const USER_Id = "abc123";

export const SingleLogEntry = () => {
  const { logId } = useParams() as { logId: string };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [removeLogEntry] = useRemoveLogEntryMutation();

  const { data: allPeakLists = [] } = useGetListsQuery();

  const { data: entry, isLoading, error } = useLogEntry(logId, USER_Id);

  useEffect(() => {
    if (entry) {
      const logPeaks = getPeaksById(entry.peakIds, allPeakLists);
      dispatch(plotLogEntry(logPeaks));
    }
  }, [entry]);

  const handleRemove = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      removeLogEntry({ userId: USER_Id, logId: logId });
      navigate("/log");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <LoadingSpinner />
      </Card>
    );
  }

  if (error || !entry) {
    return (
      <Card>
        <p>ERROR</p>
      </Card>
    );
  }

  const displayDate = getDisplayDate(entry.date);

  return (
    <Card>
      <CardHeadingGrid title={displayDate} backTo={"log"}>
        <div className={headingStyles.row}>
          <span>{`${entry.peakIds.length} ${
            entry.peakIds.length > 1 ? "Peaks" : "Peak"
          }`}</span>
          <span>|</span>
          <div className={headingStyles["btn-wrapper"]}>
            <IconButton small={true} icon="trash" onClick={handleRemove} />
            <span>Delete entry</span>
          </div>
        </div>
      </CardHeadingGrid>
      <CardBody>
        <LogEntryGrid {...entry} />
      </CardBody>
    </Card>
  );
};
