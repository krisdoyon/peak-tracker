import headingStyles from "components/Card/CardHeadingGrid/CardHeadingGrid.module.scss";
import { Card, CardBody, CardHeadingGrid } from "components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { useLogContext, LogActionKind } from "context/logContext";
import { IconButton } from "components/Buttons";
import { LogEntryGrid } from "./LogEntryGrid/LogEntryGrid";
import { getDisplayDate } from "utils/getDisplayDate";
import { useMapContext } from "context/mapContext";
import { useEffect } from "react";

export const SingleLogEntry = () => {
  const { logID } = useParams();
  const navigate = useNavigate();
  const { getLogEntryById, dispatch } = useLogContext();
  const { plotLogEntry } = useMapContext();

  useEffect(() => {
    if (logID) {
      plotLogEntry(logID);
    }
  }, [logID]);

  if (logID) {
    const handleRemove = () => {
      if (confirm("Are you sure you want to delete this entry?")) {
        dispatch({ type: LogActionKind.REMOVE_ENTRY, payload: logID });
        navigate("/log");
      }
    };

    const entry = getLogEntryById(logID);

    if (entry) {
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
    } else
      return (
        <Card>
          <div>ERROR</div>
        </Card>
      );
  }
  return <></>;
};
