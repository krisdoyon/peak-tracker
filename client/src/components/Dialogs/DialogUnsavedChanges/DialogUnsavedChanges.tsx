import { Modal } from "components/Modals/Modal";
import styles from "./DialogUnsavedChanges.module.scss";
import { Button } from "components/Buttons";

export const DialogUnsavedChanges = () => {
  return (
    <Modal className={styles.modal}>
      <p>You have unsaved changes. Do you want to proceed?</p>
      <div>
        <Button>Yes</Button>
        <Button>No</Button>
      </div>
    </Modal>
  );
};
