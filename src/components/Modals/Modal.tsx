import styles from "./Modal.module.scss";
import ReactDOM from "react-dom";
import { useAppDispatch } from "hooks/reduxHooks";
import { closeModal } from "features/modalSlice";

interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

const Overlay = () => {
  const dispatch = useAppDispatch();
  return (
    <div className={styles.overlay} onClick={() => dispatch(closeModal())} />
  );
};

export const Modal = ({ children, className }: ModalProps) => {
  const dispatch = useAppDispatch();
  return ReactDOM.createPortal(
    <>
      <Overlay />
      <div className={`${styles.modal} ${className ? className : ""}`}>
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
