import { Link } from "react-router-dom";
import styles from "./Card.module.scss";

interface Props {
  children?: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  return (
    <div className={styles.card}>
      <Link to="/" className={styles["btn-close"]}>
        &times;
      </Link>
      {children}
    </div>
  );
};
