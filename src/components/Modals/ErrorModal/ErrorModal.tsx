import { useAppSelector } from "hooks/reduxHooks";
import { Modal } from "../Modal";
import { transformApiError } from "utils/errorUtil";
import styles from "./ErrorModal.module.scss";

export const ErrorModal = () => {
  const { error } = useAppSelector((state) => state.modal);
  const errorMessage = transformApiError(error);

  return (
    <Modal className={styles.modal}>
      <p className={styles.message}>{errorMessage}</p>
    </Modal>
  );
};
