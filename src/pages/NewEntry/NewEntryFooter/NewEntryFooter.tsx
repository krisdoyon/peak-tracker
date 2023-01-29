import { AddButton, TextButton } from "components/Buttons";
import { clearMap } from "features/mapSlice";
import { resetForm } from "features/newEntrySlice";
import { useAppDispatch } from "hooks/reduxHooks";
import styles from "./NewEntryFooter.module.scss";

export const NewEntryFooter = () => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.footer}>
      <TextButton
        onClick={() => {
          dispatch(resetForm());
          dispatch(clearMap());
        }}
      >
        Clear form
      </TextButton>
      <AddButton type="submit" form="form-new-entry" />
    </div>
  );
};
