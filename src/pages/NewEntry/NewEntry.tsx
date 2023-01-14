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

export const NewEntry = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formRef.current) {
      const data = Object.fromEntries(new FormData(formRef.current));
      console.log(data);
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
          ref={formRef}
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
