import { AddButton, TextButton } from "components/Buttons";
import { clearMap } from "features/mapSlice";
import { resetForm } from "features/newEntrySlice";
import { useAppDispatch, useAppSelector } from "hooks/reduxHooks";
import styles from "./NewEntryFooter.module.scss";
import { ModifyButton } from "components/Buttons/ModifyButton/ModifyButton";

export const NewEntryFooter = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { isEditing } = useAppSelector((state) => state.newEntry);

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
      {!isEditing && (
        <AddButton type="submit" form="form-new-entry" disabled={!isLoggedIn} />
      )}
      {isEditing && (
        <ModifyButton
          type="submit"
          form="form-new-entry"
          disabled={!isLoggedIn}
        />
      )}
    </div>
  );
};
