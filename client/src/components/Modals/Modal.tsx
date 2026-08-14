import styles from "./Modal.module.scss";
import ReactDOM from "react-dom";
import { useAppDispatch } from "hooks/reduxHooks";
import { closeModal } from "features/modalSlice";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const Overlay = () => {
  const dispatch = useAppDispatch();
  return (
    <div
      className={styles.overlay}
      onClick={() => dispatch(closeModal())}
      data-testid="overlay"
    />
  );
};

export const Modal = ({ children, className, testId }: ModalProps) => {
  const dispatch = useAppDispatch();
  return ReactDOM.createPortal(
    <>
      <Overlay />
      <div
        className={`${styles.modal} ${className ? className : ""}`}
        data-testid={testId}
      >
        <button
          className={styles["btn-close"]}
          onClick={() => dispatch(closeModal())}
        >
          &times;
        </button>
        {children}
      </div>
    </>,
    document.getElementById("modal") as HTMLElement
  );
};
