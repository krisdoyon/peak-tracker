import { Link } from "react-router-dom";
import styles from "./Card.module.scss";
import sidebarStyles from "layout/Sidebar/Sidebar.module.scss";
import { useAppSelector } from "hooks/reduxHooks";

interface Props {
  children?: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  const { sidebarOpen } = useAppSelector((state) => state.sidebar);
  return (
    <div
      className={`${styles.card} ${sidebarOpen ? "" : sidebarStyles.hidden}`}
    >
      <Link to="/" className={styles["btn-close"]}>
        &times;
      </Link>
      {children}
    </div>
  );
};
