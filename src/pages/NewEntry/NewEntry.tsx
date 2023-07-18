import { Card, CardHeading, CardBody } from "components/Card";
import styles from "./NewEntry.module.scss";
import { NewEntryDate } from "./NewEntryDate/NewEntryDate";
import { NewEntryFooter } from "./NewEntryFooter/NewEntryFooter";
import { NewEntryNotes } from "./NewEntryNotes/NewEntryNotes";
import { NewEntryPeaks } from "./NewEntryPeaks/NewEntryPeaks";
import { NewEntryRating } from "./NewEntryRating/NewEntryRating";
import { NewEntryStats } from "./NewEntryStats/NewEntryStats";
import { useAddLogEntry } from "hooks/useAddLogEntry";
import { useAppSelector } from "hooks/reduxHooks";

export const NewEntry = () => {
  const { handleAdd } = useAddLogEntry();
  const { isEditing } = useAppSelector((state) => state.newEntry);
  return (
    <Card>
      <CardHeading title={isEditing ? "Modify Log Entry" : "New Log Entry"} />
      <CardBody>
        <form id="form-new-entry" className={styles.form} onSubmit={handleAdd}>
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
