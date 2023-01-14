import styles from "./SingleLogEntry.module.scss";
import headingStyles from "components/Card/CardHeadingGrid/CardHeadingGrid.module.scss";
import { Card, CardBody, CardHeadingGrid } from "components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { useLogContext, LogActionKind } from "context/logContext";
import { IconButton } from "components/Buttons";
import { LogEntryGrid } from "./LogEntryGrid/LogEntryGrid";

export const SingleLogEntry = () => {
  const { logID } = useParams();
  const navigate = useNavigate();
  const { getLogEntryById, logDispatch } = useLogContext();

  const handleRemove = () => {
    if (confirm("Are you sure you want to delete this entry?")) {
      logDispatch({ type: LogActionKind.REMOVE_ENTRY, payload: logID });
      navigate("/log");
    }
  };

  let entry;
  if (logID) {
    entry = getLogEntryById(logID);
  }

  if (entry) {
    return (
      <Card>
        <CardHeadingGrid title={entry.displayDate} backTo={"log"}>
          <div className={headingStyles.row}>
            <span>{`${entry.peaks.length} ${
              entry.peaks.length > 1 ? "Peaks" : "Peak"
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
};
