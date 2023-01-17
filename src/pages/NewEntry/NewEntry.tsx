import { Card, CardHeading, CardBody } from "components/Card";
import React, { useRef } from "react";
import styles from "./NewEntry.module.scss";
import { NewEntryDate } from "./NewEntryDate/NewEntryDate";
import { NewEntryFooter } from "./NewEntryFooter/NewEntryFooter";
import { NewEntryNotes } from "./NewEntryNotes/NewEntryNotes";
import { NewEntryPeaks } from "./NewEntryPeaks/NewEntryPeaks";
import { NewEntryRating } from "./NewEntryRating/NewEntryRating";
import { NewEntryStats } from "./NewEntryStats/NewEntryStats";
import { ILogEntry } from "models/interfaces";
import { useNewEntryContext } from "context/newEntryContext";
import { LogActionKind, useLogContext } from "context/logContext";

export const NewEntry = () => {
  const { dispatch, addLogEntry } = useLogContext();
  const { state } = useNewEntryContext();

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    addLogEntry();

    // const newEntry: ILogEntry = {};
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
