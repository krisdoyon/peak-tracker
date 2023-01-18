import { Card, CardHeading, CardBody } from "components/Card";
import styles from "./NewEntry.module.scss";
import { NewEntryDate } from "./NewEntryDate/NewEntryDate";
import { NewEntryFooter } from "./NewEntryFooter/NewEntryFooter";
import { NewEntryNotes } from "./NewEntryNotes/NewEntryNotes";
import { NewEntryPeaks } from "./NewEntryPeaks/NewEntryPeaks";
import { NewEntryRating } from "./NewEntryRating/NewEntryRating";
import { NewEntryStats } from "./NewEntryStats/NewEntryStats";
import { useLogContext } from "context/logContext";
import { useNavigate } from "react-router-dom";

export const NewEntry = () => {
  const { addLogEntry, setLogEntryId } = useLogContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const logId = setLogEntryId();
    const isAdded = addLogEntry(logId);
    if (isAdded) {
      navigate(`/log/${logId}`);
    }
  };

  return (
    <Card>
      <CardHeading title={"New Log Entry"} />
      <CardBody>
        <form
          id="form-new-entry"
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <NewEntryDate />
          <NewEntryPeaks />
          <NewEntryStats />
          <NewEntryNotes />
          <NewEntryRating />
        </form>
        <NewEntryFooter />
      </CardBody>
    </Card>
  );
};
