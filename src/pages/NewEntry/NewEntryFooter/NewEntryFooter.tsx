import { AddButton, TextButton } from "components/Buttons";
import {
  NewEntryActionType,
  useNewEntryContext,
} from "context/newEntryContext";
import styles from "./NewEntryFooter.module.scss";

export const NewEntryFooter = () => {
  const { state, dispatch } = useNewEntryContext();
  return (
    <div className={styles.footer}>
      <TextButton
        onClick={() => {
          dispatch({ type: NewEntryActionType.RESET_FORM });
        }}
      >
        Clear form
      </TextButton>
      <AddButton type="submit" form="form-new-entry" />
    </div>
  );
};
