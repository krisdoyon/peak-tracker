import { useSidebarContext } from "context/sidebarContext";
import { Link } from "react-router-dom";
import styles from "./Card.module.scss";
import sidebarStyles from "layout/Sidebar/Sidebar.module.scss";

interface Props {
  children?: React.ReactNode;
}

export const Card = ({ children }: Props) => {
  const { sidebarOpen } = useSidebarContext();
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
