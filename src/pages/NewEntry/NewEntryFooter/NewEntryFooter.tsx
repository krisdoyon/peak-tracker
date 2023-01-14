import { AddButton, TextButton } from "components/Buttons";
import styles from "./NewEntryFooter.module.scss";

export const NewEntryFooter = () => {
  return (
    <div className={styles.footer}>
      <TextButton>Clear form</TextButton>
      <AddButton type="submit" form="form-new-entry" />
    </div>
  );
};
