import { IconButton } from "components/Buttons";
import { useNavigate } from "react-router-dom";
import styles from "./CardHeadingGrid.module.scss";

interface Props {
  title: string;
  backTo: "peak-lists" | "log";
  children?: React.ReactNode;
}

export const CardHeadingGrid = ({ children, title, backTo }: Props) => {
  const navigate = useNavigate();

  return (
    <div className={styles.grid}>
      <IconButton
        icon="arrow-left"
        onClick={() => navigate(`/${backTo}`)}
        className={styles["btn-back"]}
      ></IconButton>
      <h2>{title}</h2>
      {children}
    </div>
  );
};
